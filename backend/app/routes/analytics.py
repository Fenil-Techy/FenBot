from fastapi import APIRouter, Depends
from app.dependencies.supabase_auth import get_current_owner_id
from app.services import analytics_service

router = APIRouter(prefix="/dashboard/analytics")

@router.get("/{chatbot_id}")
async def get_analytics(chatbot_id: str, owner_id: str = Depends(get_current_owner_id)):
    return await analytics_service.get_analytics(owner_id, chatbot_id)
