from app.core.config import settings
import asyncpg
_pool:asyncpg.Pool | None = None

async def get_pool():
    global _pool
    if _pool is None:
        print(settings.DATABASE_URL)
        _pool= await asyncpg.create_pool(settings.DATABASE_URL)
    return _pool