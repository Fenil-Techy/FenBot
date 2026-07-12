async def get_client_data(conn, owner_id: str):
    return await conn.fetchrow(
        "SELECT business_name, plan, created_at FROM clients WHERE owner_id = $1", owner_id
    )

async def update_business_name(conn, business_name: str, owner_id: str):
    return await conn.fetchrow(
        "UPDATE clients SET business_name = $1 WHERE owner_id = $2 RETURNING business_name",
        business_name, owner_id
    )