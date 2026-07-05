from app.dependencies.database_conn import get_pool
from app.dependencies.supabase_auth import get_current_owner_id
from app.utils.apikeys import generate_api_key
from fastapi import Depends
from fastapi import HTTPException
from fastapi import APIRouter

router=APIRouter(prefix="/dashboard")

async def _get_client_id(owner_id:str,conn)->str:
    row=await conn.fetchrow("SELECT id FROM clients WHERE owner_id=$1",owner_id)
    if not row:
        raise HTTPException(status_code=404,detail="Client not found")
    return str(row["id"])

@router.post("/api-keys")
async def create_api_key(owner_id:str=Depends(get_current_owner_id)):
    pool=await get_pool()
    async with pool.acquire() as conn:
        client=await _get_client_id(owner_id,conn)
        raw_key,hash_key,prefix=generate_api_key()
        await conn.execute(
            """insert into api_keys(client_id,key_hash,key_prefix) values($1,$2,$3)""",
            client,
            hash_key,
            prefix
        )
        return {"raw_key":raw_key,"prefix":prefix}

@router.get("/api-keys")
async def get_all_api_keys(owner_id:str=Depends(get_current_owner_id)):
    pool=await get_pool()
    async with pool.acquire() as conn:
        client=await _get_client_id(owner_id,conn)
        rows=await conn.fetch(
            "SELECT key_prefix,created_at,revoked FROM api_keys WHERE client_id=$1",
            client
        )
    return [dict(row) for row in rows]
        
            
    