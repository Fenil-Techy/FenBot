from app.core.config import settings
import httpx
from jose import jwt
from jose.utils import base64url_decode
from fastapi import Header, HTTPException

JWKS_URL = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"

async def get_current_owner_id(
    authorization: str = Header(...)
) -> str:

    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")

    token = authorization.split(" ", 1)[1]

    async with httpx.AsyncClient() as client:
        jwks = (await client.get(JWKS_URL)).json()

    header = jwt.get_unverified_header(token)

    key = next(
        (k for k in jwks["keys"] if k["kid"] == header["kid"]),
        None,
    )

    if key is None:
        raise HTTPException(401, "Invalid key")

    payload = jwt.decode(
        token,
        key,
        algorithms=["ES256"],
        audience="authenticated",
    )

    return payload["sub"]