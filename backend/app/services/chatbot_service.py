from app.dependencies.database_conn import get_pool
from app.repositories import chatbot_repo, client_repo
from fastapi import HTTPException

async def create_chatbot(owner_id: str, name: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)
        row = await chatbot_repo.create(conn, client_id, name)
        return dict(row)

async def list_chatbots(owner_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)
        rows = await chatbot_repo.list_chatbots(conn, client_id)
        return [dict(r) for r in rows]

async def get_chatbot(owner_id: str, chatbot_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)
        row = await chatbot_repo.get_chatbot(conn, chatbot_id, client_id)
        if not row:
            raise HTTPException(status_code=404, detail="Chatbot not found")
        return dict(row)

async def update_chatbot(owner_id: str, chatbot_id: str, payload: dict):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)
        owned = await chatbot_repo.verify_chatbot_owner(conn, chatbot_id, client_id)
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
        row = await chatbot_repo.update_chatbot(conn, chatbot_id, fields, values)
        return dict(row)
