async def create_documents(conn, chatbot_id: str, rows: list):
    await conn.executemany(
        """
        INSERT INTO documents (chatbot_id, content, embedding)
        VALUES ($1, $2, $3)
        """,
        rows,
    )

async def list_documents(conn, chatbot_id: str, owner_id: str):
    return await conn.fetch(
        """
        SELECT d.id, d.content, d.created_at FROM documents d
        JOIN chatbots c ON c.id = d.chatbot_id
        JOIN clients cl ON cl.id = c.client_id
        WHERE d.chatbot_id = $1 AND cl.owner_id = $2
        ORDER BY d.created_at DESC
        """,
        chatbot_id, owner_id
    )

async def delete_document(conn, doc_id: str, chatbot_id: str) -> bool:
    result = await conn.execute(
        "DELETE FROM documents WHERE id = $1 AND chatbot_id = $2",
        doc_id, chatbot_id
    )
    return result != "DELETE 0"
