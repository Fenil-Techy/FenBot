import asyncpg
from app.core.config import settings

pool = None

async def connect_db():
    global pool

    if pool is None:
        pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=1,
            max_size=5,   # keep this low for Supabase
        )

async def get_pool():
    return pool

async def close_db():
    global pool
    if pool:
        await pool.close()