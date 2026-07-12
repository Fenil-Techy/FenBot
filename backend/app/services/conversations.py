from app.dependencies.database_conn import get_pool

async def get_or_create_conversation(chatbot_id:str,visitor_id:str)->str:
    pool=await get_pool()
    async with pool.acquire() as conn:
        row=await conn.fetchrow(
            """
            SELECT id FROM conversations WHERE chatbot_id=$1 AND visitor_id=$2
            AND last_message_at > (NOW() - interval '30 minute')
            ORDER BY last_message_at DESC LIMIT 1
            """,
            chatbot_id,visitor_id
        )

        if row:
            return str(row["id"])
        new_row = await conn.fetchrow(
            "INSERT INTO conversations (chatbot_id, visitor_id) VALUES ($1, $2) RETURNING id",
            chatbot_id, visitor_id
        )
        return str(new_row["id"])
    
async def save_messages(conversation_id:str,role:str,content:str):
    pool =await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO messages (conversation_id,role,content) VALUES($1,$2,$3)",
            conversation_id,role,content
        )
        await conn.execute(
            "UPDATE conversations SET last_message_at = now() WHERE id = $1", conversation_id
        )
        