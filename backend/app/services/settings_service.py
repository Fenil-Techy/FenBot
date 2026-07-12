from app.dependencies.database_conn import get_pool
from app.repositories import settings_repo
from fastapi import HTTPException

async def get_settings(owner_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await settings_repo.get_client_data(conn, owner_id)
        if not row:
            raise HTTPException(status_code=404, detail="Client not found")
        return dict(row)

async def update_settings(owner_id: str, business_name: str):
    business_name = business_name.strip()
    if not business_name:
        raise HTTPException(status_code=400, detail="Business name cannot be empty")

    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await settings_repo.update_business_name(conn, business_name, owner_id)
        if not row:
            raise HTTPException(status_code=404, detail="Client not found")
        return dict(row)