import asyncpg
from app.core.config import settings
from pgvector.asyncpg import register_vector
pool = None

async def connect_db():
    global pool

    if pool is None:
        pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=1,
            max_size=5, 
            init=register_vector,  # keep this low for Supabase
        )

async def get_pool():
    return pool

async def close_db():
    global pool
    if pool:
        await pool.close()