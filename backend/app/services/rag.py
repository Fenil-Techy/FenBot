from openai.types import embedding
from openai.types.responses import response
import asyncpg
from app.core.config import settings
from openai import AsyncOpenAI

client=AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

_pool:asyncpg.Pool | None = None

async def get_pool():
    global _pool
    if _pool is None:
        print(settings.DATABASE_URL)
        _pool= await asyncpg.create_pool(settings.DATABASE_URL)
    return _pool

async def embed_text(text:str)->list[float]:
    response=await client.embeddings.create(
        model="text-embedding-3-small",
        input=[text]
    )
    return response.data[0].embedding   

async def add_document(content:str,client_id:str="default"):
    embedding=await embed_text(content)
    pool=await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
        """
        INSERT INTO documents (content,client_id,embedding)
        VALUES ($1,$2,$3)
        """,
        content,client_id,str(embedding)
        )

async def retrieve(query:str,client_id:str="default",top_k:int=2)->list[str]:
    query_embedding=await embed_text(query)
    pool=await get_pool()
    async with pool.acquire() as conn:
        rows=await conn.fetch(
            """
            SELECT content FROM documents
            WHERE client_id = $1
            ORDER BY embedding <=> $2
            LIMIT $3
            """,
            client_id,str(query_embedding),top_k
        )
        return [row["content"] for row in rows]