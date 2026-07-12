async def get_monthly_conversation_usage(conn, client_id: str):
    return await conn.fetchval(
        """
        SELECT count(*) FROM conversations co
        JOIN chatbots cb ON cb.id = co.chatbot_id
        WHERE cb.client_id = $1 AND co.started_at >= date_trunc('month', now())
        """,
        client_id
    )

async def get_chatbot_count(conn, client_id: str):
    return await conn.fetchval(
        "SELECT count(*) FROM chatbots WHERE client_id = $1",
        client_id
    )
