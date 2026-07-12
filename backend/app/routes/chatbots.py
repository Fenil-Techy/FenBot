from fastapi import APIRouter, Depends
from app.dependencies.supabase_auth import get_current_owner_id
from app.services import chatbot_service

router = APIRouter(prefix="/dashboard/chatbots")

@router.post("")
async def create_chatbot(payload: dict, owner_id: str = Depends(get_current_owner_id)):
    return await chatbot_service.create_chatbot(owner_id, payload.get("name", ""))

@router.get("")
async def list_chatbots(owner_id: str = Depends(get_current_owner_id)):
    return await chatbot_service.list_chatbots(owner_id)

@router.get("/{chatbot_id}")
async def get_chatbot(chatbot_id: str, owner_id: str = Depends(get_current_owner_id)):
    return await chatbot_service.get_chatbot(owner_id, chatbot_id)

@router.patch("/{chatbot_id}")
async def update_chatbot(chatbot_id: str, payload: dict, owner_id: str = Depends(get_current_owner_id)):
    return await chatbot_service.update_chatbot(owner_id, chatbot_id, payload)
