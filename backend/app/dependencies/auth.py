
from fastapi import HTTPException
from app.dependencies.database_conn import get_pool
from app.utils.apikeys import hash_key_check

async def get_client_id_from_api_key(api_key:str,store_domain:str):
    hash_key=hash_key_check(api_key)
    pool=await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT client_id FROM api_keys WHERE key_hash = $1 AND revoked = false",
            hash_key
        )
    if not row:
        raise HTTPException(status_code=401, detail="Invalid or revoked API key")
    return str(row["client_id"])