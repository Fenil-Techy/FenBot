
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
        raise HTTPException(status_code=404,detail="Client not found")
    return str(row["id"])

@router.post("/chatbots")
async def create_chatbot(payload: dict, owner_id: str = Depends(get_current_owner_id)):
    name = payload.get("name", "My Chatbot").strip() or "My Chatbot"

    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)
        row = await conn.fetchrow(
            "INSERT INTO chatbots (client_id, name) VALUES ($1, $2) RETURNING id, name, persona, brand_color, status, created_at",
            client_id, name
        )
    return dict(row)

@router.get("/chatbots")
async def list_chatbots(owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await _get_client_id(owner_id, conn)
        rows = await conn.fetch(
            "SELECT id, name, persona, brand_color, status, created_at FROM chatbots WHERE client_id = $1 ORDER BY created_at DESC",
            client_id
        )
    return [dict(r) for r in rows]

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
        for key in ["name", "persona", "brand_color", "status"]:
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

# @router.delete("/documents/{doc_id}")
# async def delete_document(
#     chatbot_id:str,
#     doc_id: str,
#     owner_id: str = Depends(get_current_owner_id),
# ):
#     pool = await get_pool()

#     async with pool.acquire() as conn:
        

#         result = await conn.execute(
#             """
#             DELETE FROM documents
#             WHERE id = $1
#             AND client_id = $2
#             """,
#             doc_id,
#             client_id,
#         )

#     if result == "DELETE 0":
#         raise HTTPException(
#             status_code=404,
#             detail="Document not found",
#         )

#     return {"deleted": True}