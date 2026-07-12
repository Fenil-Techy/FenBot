from fastapi import APIRouter, Depends
from app.dependencies.supabase_auth import get_current_owner_id
from app.services import billing_service

router = APIRouter(prefix="/dashboard/billing")

@router.get("")
async def get_billing(owner_id: str = Depends(get_current_owner_id)):
    return await billing_service.get_billing(owner_id)
