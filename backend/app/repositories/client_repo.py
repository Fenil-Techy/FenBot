async def get_or_create_client_id(conn, owner_id: str) -> str:
    row = await conn.fetchrow("SELECT id FROM clients WHERE owner_id = $1", owner_id)
    if not row:
        row = await conn.fetchrow(
            "INSERT INTO clients (owner_id, business_name) VALUES ($1, $2) RETURNING id",
            owner_id, "My Business"
        )
    return str(row["id"])

async def get_client_row(conn, owner_id: str):
    return await conn.fetchrow("SELECT id, plan FROM clients WHERE owner_id = $1", owner_id)
