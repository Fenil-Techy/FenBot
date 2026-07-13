from fastapi import APIRouter, Depends
from app.dependencies.database_conn import get_pool
from app.dependencies.supabase_auth import get_current_owner_id
from app.repositories import client_repo

router = APIRouter(prefix="/dashboard")

@router.get("/home-summary")
async def home_summary(owner_id: str = Depends(get_current_owner_id)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)

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
            SELECT co.id, co.visitor_id, cb.id as chatbot_id, cb.name as bot_name, co.last_message_at,
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