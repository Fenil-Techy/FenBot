from fastapi import APIRouter, Depends
from app.dependencies.supabase_auth import get_current_owner_id
from app.services import settings_service

router = APIRouter(prefix="/dashboard/settings")

@router.get("")
async def get_settings(owner_id: str = Depends(get_current_owner_id)):
    return await settings_service.get_settings(owner_id)

@router.patch("")
async def update_settings(payload: dict, owner_id: str = Depends(get_current_owner_id)):
    return await settings_service.update_settings(owner_id, payload.get("business_name", ""))
