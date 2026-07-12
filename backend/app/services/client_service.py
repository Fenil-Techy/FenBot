from app.dependencies.database_conn import get_pool
from app.repositories import client_repo

async def get_or_create_client_id(owner_id: str) -> str:
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await client_repo.get_or_create_client_id(conn, owner_id)
