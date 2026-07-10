from fastapi import HTTPException
from app.dependencies.database_conn import get_pool
async def get_bot_context(chatbot_id:str)->dict:
    pool=await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, client_id, name, persona, status FROM chatbots WHERE id = $1",
            chatbot_id
            )
    if not row:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    if row["status"] != "active":
        raise HTTPException(status_code=403, detail="This chatbot is currently paused")
    return dict(row)