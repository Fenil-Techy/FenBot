
from app.dependencies.bot import get_bot_context
from fastapi import Depends
from app.utils.message_formatter import message_formatter
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.chat import chatRequest
from app.services.llm import generate

router=APIRouter()

@router.post("/chat/{chatbot_id}")
async def chat(request: chatRequest,chatbot_info:dict=Depends(get_bot_context)):
    formatted_messages=message_formatter(request.messages)
    async def stream():
        async for chunk in generate(formatted_messages,chatbot_id=chatbot_info["id"],persona=chatbot_info["persona"]):
            yield chunk

    return StreamingResponse(stream(), media_type="text/plain")
    
