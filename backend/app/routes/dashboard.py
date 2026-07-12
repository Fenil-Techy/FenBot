
from app.utils.chunking import chunk_text
from app.services.rag import embed_texts
from app.dependencies.database_conn import get_pool
from app.dependencies.supabase_auth import get_current_owner_id

from fastapi import Depends
from fastapi import HTTPException
from fastapi import APIRouter

router=APIRouter(prefix="/dashboard")

async def _get_client_id(owner_id:str,conn)->str:
    row=await conn.fetchrow("SELECT id FROM clients WHERE owner_id=$1",owner_id)
    if not row:
        row = await conn.fetchrow(
            "INSERT INTO clients (owner_id, business_name) VALUES ($1, $2) RETURNING id",
            owner_id, "My Business"
        )
    return str(row["id"])

@router.get("/home-summary")
async def home_summary(owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)

        bots = await conn.fetch(
            "SELECT id, name, status FROM chatbots WHERE client_id = $1 ORDER BY created_at DESC",
            client_id
        )
        today_count = await conn.fetchval(
            """
            SELECT count(*) FROM conversations co
            JOIN chatbots cb ON cb.id = co.chatbot_id
            WHERE cb.client_id = $1 AND co.started_at >= current_date
            """,
            client_id
        )
        recent = await conn.fetch(
            """
            SELECT co.id, cb.name as bot_name, co.last_message_at,
                   (SELECT content FROM messages m WHERE m.conversation_id = co.id ORDER BY m.created_at DESC LIMIT 1) as last_message
            FROM conversations co
            JOIN chatbots cb ON cb.id = co.chatbot_id
            WHERE cb.client_id = $1
            ORDER BY co.last_message_at DESC LIMIT 5
            """,
            client_id
        )

        has_docs = await conn.fetchval(
            "SELECT EXISTS(SELECT 1 FROM documents d JOIN chatbots cb ON cb.id = d.chatbot_id WHERE cb.client_id = $1)",
            client_id
        )
        has_convs = await conn.fetchval(
            "SELECT EXISTS(SELECT 1 FROM conversations co JOIN chatbots cb ON cb.id = co.chatbot_id WHERE cb.client_id = $1)",
            client_id
        )

    return {
        "bots": [dict(b) for b in bots],
        "conversations_today": today_count,
        "recent_conversations": [dict(r) for r in recent],
        "has_bot": len(bots) > 0,
        "has_docs": has_docs,
        "has_convs": has_convs,
    }

@router.post("/chatbots")
async def create_chatbot(payload: dict, owner_id: str = Depends(get_current_owner_id)):
    name = payload.get("name", "My Chatbot").strip() or "My Chatbot"

    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)
        row = await conn.fetchrow(
            "INSERT INTO chatbots (client_id, name) VALUES ($1, $2) RETURNING id, name, persona, welcome_message,tone,language,input_placeholder,bubble_color,header_color,accent_color, status, created_at",
            client_id, name
        )
    return dict(row)

@router.get("/chatbots")
async def list_chatbots(owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)
        rows = await conn.fetch(
            "SELECT id, name, persona, welcome_message,tone,language,input_placeholder,bubble_color,header_color,accent_color, status, created_at FROM chatbots WHERE client_id = $1 ORDER BY created_at DESC",
            client_id
        )
    return [dict(r) for r in rows]

@router.get("/chatbots/{chatbot_id}")
async def get_chatbot(chatbot_id: str, owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)
        row = await conn.fetchrow(
            "SELECT id, name, persona, welcome_message, tone, language, input_placeholder, bubble_color, header_color, accent_color, status, created_at FROM chatbots WHERE id = $1 AND client_id = $2",
            chatbot_id, client_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Chatbot not found")
    return dict(row)

@router.patch("/chatbots/{chatbot_id}")
async def update_chatbot(chatbot_id: str, payload: dict, owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)
        owned = await conn.fetchrow(
            "SELECT id FROM chatbots WHERE id = $1 AND client_id = $2", chatbot_id, client_id
        )
        if not owned:
            raise HTTPException(status_code=404, detail="Chatbot not found")

        fields, values = [], []
        for key in ["name", "persona", "welcome_message", "tone", "language", "input_placeholder", "bubble_color", "header_color", "accent_color", "status"]:
            if key in payload:
                values.append(payload[key])
                fields.append(f"{key} = ${len(values)}")

        if not fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        values.append(chatbot_id)
        query = f"UPDATE chatbots SET {', '.join(fields)} WHERE id = ${len(values)} RETURNING *"
        row = await conn.fetchrow(query, *values)
    return dict(row)


@router.post("/chatbots/{chatbot_id}/documents")
async def add_documents(
    chatbot_id:str,
    payload: dict,
    owner_id: str = Depends(get_current_owner_id),
):
    text = payload.get("text", "").strip()

    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    chunks = chunk_text(text)

    if not chunks:
        raise HTTPException(status_code=400, detail="No valid chunks")

    # Batch embedding (1 API call)
    embeddings = await embed_texts(chunks)

    pool = await get_pool()

    async with pool.acquire() as conn:
        owned = await conn.fetchrow(
            """
            SELECT c.id FROM chatbots c
            JOIN clients cl ON cl.id = c.client_id
            WHERE c.id = $1 AND cl.owner_id = $2
            """,
            chatbot_id, owner_id
        )
        if not owned:
            raise HTTPException(status_code=404, detail="Chatbot not found")
        rows = [
            (
                chatbot_id,
                chunk,
                embedding,
            )
            for chunk, embedding in zip(chunks, embeddings)
        ]

        await conn.executemany(
            """
            INSERT INTO documents
            (chatbot_id, content, embedding)
            VALUES ($1, $2, $3)
            """,
            rows,
        )

    return {
        "chunks_added": len(chunks)
    }


@router.get("/chatbots/{chatbot_id}/documents")
async def list_documents(
    chatbot_id:str,
    owner_id: str = Depends(get_current_owner_id),
):
    pool = await get_pool()

    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT d.id, d.content, d.created_at FROM documents d
            JOIN chatbots c ON c.id = d.chatbot_id
            JOIN clients cl ON cl.id = c.client_id
            WHERE d.chatbot_id = $1 AND cl.owner_id = $2
            ORDER BY d.created_at DESC
            """,
            chatbot_id, owner_id
        )
    return [dict(r) for r in rows]


@router.delete("/chatbots/{chatbot_id}/documents/{doc_id}")
async def delete_document(chatbot_id: str, doc_id: str, owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)
        owned = await conn.fetchrow(
            "SELECT id FROM chatbots WHERE id = $1 AND client_id = $2", chatbot_id, client_id
        )
        if not owned:
            raise HTTPException(status_code=404, detail="Chatbot not found")
        result = await conn.execute(
            "DELETE FROM documents WHERE id = $1 AND chatbot_id = $2", doc_id, chatbot_id
        )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Document not found")
    return {"deleted": True}

@router.get("/conversations")
async def list_conversations(chatbot_id: str | None = None, owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)

        query = """
            SELECT co.id, co.visitor_id, co.last_message_at, cb.name as bot_name, cb.id as chatbot_id,
                   (SELECT content FROM messages m WHERE m.conversation_id = co.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
                   (SELECT count(*) FROM messages m WHERE m.conversation_id = co.id) as message_count
            FROM conversations co
            JOIN chatbots cb ON cb.id = co.chatbot_id
            WHERE cb.client_id = $1
        """
        params = [client_id]

        if chatbot_id:
            query += " AND cb.id = $2"
            params.append(chatbot_id)

        query += " ORDER BY co.last_message_at DESC LIMIT 100"

        rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]

@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(conversation_id: str, owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)

        # ownership check
        owned = await conn.fetchrow(
            """
            SELECT co.id FROM conversations co
            JOIN chatbots cb ON cb.id = co.chatbot_id
            WHERE co.id = $1 AND cb.client_id = $2
            """,
            conversation_id, client_id
        )
        if not owned:
            raise HTTPException(status_code=404, detail="Conversation not found")

        rows = await conn.fetch(
            "SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
            conversation_id
        )
    return [dict(r) for r in rows]

@router.get("/analytics/{chatbot_id}")
async def get_analytics(chatbot_id: str, owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)

        owned = await conn.fetchrow(
            "SELECT id FROM chatbots WHERE id = $1 AND client_id = $2", chatbot_id, client_id
        )
        if not owned:
            raise HTTPException(status_code=404, detail="Chatbot not found")

        totals = await conn.fetchrow(
            """
            SELECT
                count(*) as total_conversations,
                coalesce(sum(extract(epoch from (last_message_at - started_at))), 0) as total_duration_seconds
            FROM conversations WHERE chatbot_id = $1
            """,
            chatbot_id
        )

        total_messages = await conn.fetchval(
            """
            SELECT count(*) FROM messages m
            JOIN conversations co ON co.id = m.conversation_id
            WHERE co.chatbot_id = $1
            """,
            chatbot_id
        )

        daily_volume = await conn.fetch(
            """
            SELECT date(started_at) as day, count(*) as count
            FROM conversations
            WHERE chatbot_id = $1 AND started_at >= now() - interval '14 days'
            GROUP BY date(started_at)
            ORDER BY day ASC
            """,
            chatbot_id
        )

        top_questions = await conn.fetch(
            """
            SELECT lower(trim(m.content)) as question, count(*) as count
            FROM messages m
            JOIN conversations co ON co.id = m.conversation_id
            WHERE co.chatbot_id = $1 AND m.role = 'user'
            GROUP BY lower(trim(m.content))
            ORDER BY count DESC
            LIMIT 10
            """,
            chatbot_id
        )

    return {
        "total_conversations": totals["total_conversations"],
        "total_messages": total_messages,
        "total_duration_seconds": int(totals["total_duration_seconds"]),
        "daily_volume": [{"day": str(r["day"]), "count": r["count"]} for r in daily_volume],
        "top_questions": [dict(r) for r in top_questions],
    }