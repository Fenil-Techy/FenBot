from fastapi import APIRouter
from app.schemas.chat import chatRequest,chatResponse
from app.services.openai import generate

router=APIRouter()

@router.post("/chat",response_model=chatResponse)
async def chat(request:chatRequest):
    reply=await generate(request.message)
    return chatResponse(reply=reply)
