from fastapi import APIRouter, Depends
from app.dependencies.supabase_auth import get_current_owner_id
from app.services import document_service

router = APIRouter(prefix="/dashboard/chatbots")

@router.post("/{chatbot_id}/documents")
async def add_documents(chatbot_id: str, payload: dict, owner_id: str = Depends(get_current_owner_id)):
    return await document_service.add_documents(owner_id, chatbot_id, payload.get("text", ""))

@router.get("/{chatbot_id}/documents")
async def list_documents(chatbot_id: str, owner_id: str = Depends(get_current_owner_id)):
    return await document_service.list_documents(owner_id, chatbot_id)

@router.delete("/{chatbot_id}/documents/{doc_id}")
async def delete_document(chatbot_id: str, doc_id: str, owner_id: str = Depends(get_current_owner_id)):
    return await document_service.delete_document(owner_id, chatbot_id, doc_id)
