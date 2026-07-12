async def list_conversations(conn, client_id: str, chatbot_id: str | None = None):
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
    return await conn.fetch(query, *params)

async def verify_conversation_owner(conn, conversation_id: str, client_id: str) -> bool:
    row = await conn.fetchrow(
        """
        SELECT co.id FROM conversations co
        JOIN chatbots cb ON cb.id = co.chatbot_id
        WHERE co.id = $1 AND cb.client_id = $2
        """,
        conversation_id, client_id
    )
    return row is not None

async def get_messages(conn, conversation_id: str):
    return await conn.fetch(
        "SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
        conversation_id
    )
