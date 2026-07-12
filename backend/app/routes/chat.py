
from app.services.conversations import save_messages
from app.services.conversations import get_or_create_conversation
from openai.types.conversations import conversation
from app.utils.ratelimit import check_rate_limit
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
    check_rate_limit(chatbot_info["id"])
    formatted_messages=message_formatter(request.messages)
    visitor_id = request.visitor_id or "anonymous"
    async def stream_and_log():
        conversation_id=await get_or_create_conversation(chatbot_info['id'],visitor_id)
        if formatted_messages:
            await save_messages(conversation_id,"user",formatted_messages[-1]["content"])

        full_reply=[]
        async for chunk in generate(
            formatted_messages,
            chatbot_id=chatbot_info["id"],
            persona=chatbot_info["persona"],
            tone=chatbot_info.get("tone", "friendly"),
            language=chatbot_info.get("language", "English")
        ):
            full_reply.append(chunk)
            yield chunk
        await save_messages(conversation_id,"assistant","".join(full_reply))
    return StreamingResponse(stream_and_log(), media_type="text/plain")

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
