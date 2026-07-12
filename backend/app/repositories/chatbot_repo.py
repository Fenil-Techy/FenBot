async def create(conn, client_id: str, name: str):
    return await conn.fetchrow(
        "INSERT INTO chatbots (client_id, name) VALUES ($1, $2) RETURNING id, name, persona, welcome_message, tone, language, input_placeholder, bubble_color, header_color, accent_color, status, created_at",
        client_id, name
    )

async def list_chatbots(conn, client_id: str):
    return await conn.fetch(
        "SELECT id, name, persona, welcome_message, tone, language, input_placeholder, bubble_color, header_color, accent_color, status, created_at FROM chatbots WHERE client_id = $1 ORDER BY created_at DESC",
        client_id
    )

async def get_chatbot(conn, chatbot_id: str, client_id: str):
    return await conn.fetchrow(
        "SELECT id, name, persona, welcome_message, tone, language, input_placeholder, bubble_color, header_color, accent_color, status, created_at FROM chatbots WHERE id = $1 AND client_id = $2",
        chatbot_id, client_id
    )

async def update_chatbot(conn, chatbot_id: str, fields: list, values: list):
    query = f"UPDATE chatbots SET {', '.join(fields)} WHERE id = ${len(values)} RETURNING *"
    return await conn.fetchrow(query, *values)

async def verify_chatbot_owner(conn, chatbot_id: str, client_id: str) -> bool:
    row = await conn.fetchrow(
        "SELECT id FROM chatbots WHERE id = $1 AND client_id = $2",
        chatbot_id, client_id
    )
    return row is not None

async def verify_chatbot_owner_by_owner_id(conn, chatbot_id: str, owner_id: str) -> bool:
    row = await conn.fetchrow(
        """
        SELECT c.id FROM chatbots c
        JOIN clients cl ON cl.id = c.client_id
        WHERE c.id = $1 AND cl.owner_id = $2
        """,
        chatbot_id, owner_id
    )
    return row is not None
