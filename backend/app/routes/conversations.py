from fastapi import APIRouter, Depends
from app.dependencies.supabase_auth import get_current_owner_id
from app.services import conversations_service

router = APIRouter(prefix="/dashboard/conversations")

@router.get("")
async def list_conversations(chatbot_id: str | None = None, owner_id: str = Depends(get_current_owner_id)):
    return await conversations_service.list_conversations(owner_id, chatbot_id)

@router.get("/{conversation_id}/messages")
async def get_conversation_messages(conversation_id: str, owner_id: str = Depends(get_current_owner_id)):
    return await conversations_service.get_conversation_messages(owner_id, conversation_id)
