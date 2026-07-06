from openai import AsyncOpenAI
from app.core.config import settings
from app.dependencies.database_conn import get_pool

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def embed_text(text: str) -> list[float]:
    """
    Embed a single text (used for retrieval).
    """
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )

    return response.data[0].embedding


async def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Embed multiple texts (used when indexing documents).
    """
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )

    return [item.embedding for item in response.data]


async def retrieve(
    query: str,
    client_id: str = "default",
    top_k: int = 2,
) -> list[str]:

    query_embedding = await embed_text(query)

    pool = await get_pool()

    async with pool.acquire() as conn:

        rows = await conn.fetch(
            """
            SELECT content
            FROM documents
            WHERE client_id = $1
            ORDER BY embedding <=> $2
            LIMIT $3
            """,
            client_id,
            query_embedding,
            top_k,
        )

    return [row["content"] for row in rows]