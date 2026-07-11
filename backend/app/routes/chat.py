
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
        async for chunk in generate(
            formatted_messages,
            chatbot_id=chatbot_info["id"],
            persona=chatbot_info["persona"],
            tone=chatbot_info.get("tone", "friendly"),
            language=chatbot_info.get("language", "English")
        ):
            yield chunk

    return StreamingResponse(stream(), media_type="text/plain")

@router.get("/chat/{chatbot_id}/config")
async def get_chatbot_config(chatbot_info: dict = Depends(get_bot_context)):
    return {
        "id": chatbot_info["id"],
        "name": chatbot_info["name"],
        "welcome_message": chatbot_info.get("welcome_message"),
        "input_placeholder": chatbot_info.get("input_placeholder"),
        "bubble_color": chatbot_info.get("bubble_color"),
        "header_color": chatbot_info.get("header_color"),
        "accent_color": chatbot_info.get("accent_color"),
        "status": chatbot_info["status"]
    }
