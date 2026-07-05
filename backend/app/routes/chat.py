from app.dependencies.auth import get_client_id_from_api_key
from fastapi import Depends
from app.utils.message_formatter import message_formatter
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.chat import chatRequest
from app.services.llm import generate

router=APIRouter()

@router.post("/chat")
async def chat(request: chatRequest,client_id:str=Depends(get_client_id_from_api_key)):
   
    formatted_messages=message_formatter(request.messages)
    async def stream():
        async for chunk in generate(formatted_messages,client_id=client_id):
            yield chunk

    return StreamingResponse(stream(), media_type="text/plain")
    
