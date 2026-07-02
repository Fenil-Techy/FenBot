from app.utils.message_formatter import message_formatter
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.chat import chatRequest
from app.services.llm import generate

router=APIRouter()

@router.post("/chat")
async def chat(request: chatRequest):
   
    formatted_messages=message_formatter(request.messages)
    async def stream():
        async for chunk in generate(formatted_messages):
            yield chunk

    return StreamingResponse(stream(), media_type="text/plain")
    
