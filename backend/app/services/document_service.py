from app.dependencies.database_conn import get_pool
from app.repositories import document_repo, chatbot_repo
from app.utils.chunking import chunk_text
from app.services.rag import embed_texts
from fastapi import HTTPException

async def add_documents(owner_id: str, chatbot_id: str, text: str):
    text = text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    chunks = chunk_text(text)
    if not chunks:
        raise HTTPException(status_code=400, detail="No valid chunks")

    embeddings = await embed_texts(chunks)
    pool = await get_pool()
    async with pool.acquire() as conn:
        owned = await chatbot_repo.verify_chatbot_owner_by_owner_id(conn, chatbot_id, owner_id)
        if not owned:
            raise HTTPException(status_code=404, detail="Chatbot not found")

        rows = [
            (chatbot_id, chunk, embedding)
            for chunk, embedding in zip(chunks, embeddings)
        ]
        await document_repo.create_documents(conn, chatbot_id, rows)

    return {"chunks_added": len(chunks)}

async def list_documents(owner_id: str, chatbot_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await document_repo.list_documents(conn, chatbot_id, owner_id)
        return [dict(r) for r in rows]

async def delete_document(owner_id: str, chatbot_id: str, doc_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        # verify chatbot ownership first
        row = await conn.fetchrow(
            "SELECT id FROM chatbots WHERE id = $1 AND client_id = (SELECT id FROM clients WHERE owner_id = $2)",
            chatbot_id, owner_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Chatbot not found")

        success = await document_repo.delete_document(conn, doc_id, chatbot_id)
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")

    return {"deleted": True}
