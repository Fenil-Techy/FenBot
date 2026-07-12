from app.dependencies.database_conn import get_pool
from app.repositories import conversation_repo, client_repo
from fastapi import HTTPException

async def list_conversations(owner_id: str, chatbot_id: str | None = None):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)
        rows = await conversation_repo.list_conversations(conn, client_id, chatbot_id)
        return [dict(r) for r in rows]

async def get_conversation_messages(owner_id: str, conversation_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)
        owned = await conversation_repo.verify_conversation_owner(conn, conversation_id, client_id)
        if not owned:
            raise HTTPException(status_code=404, detail="Conversation not found")

        rows = await conversation_repo.get_messages(conn, conversation_id)
        return [dict(r) for r in rows]
