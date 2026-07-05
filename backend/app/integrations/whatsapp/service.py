from app.integrations.whatsapp.send import send_whatsapp_message
from app.conversations.memory import save_history
from app.services.llm import generate
from app.conversations.memory import get_history
from app.integrations.whatsapp.extract import extract_whatsapp_payload
import logging
logger=logging.getLogger(__name__)

async def process_whatsapp_webhook(body):
    logger.info("Processing WhatsApp webhook")

    payload = extract_whatsapp_payload(body)

    if payload is None:
        logger.info("Ignoring non-message webhook")
        return

    wa_id, text = payload

    history = get_history(wa_id)

    history.append({
        "role": "user",
        "content": text,
    })

    reply_chunks = []

    async for chunk in generate(history):
        reply_chunks.append(chunk)

    reply = "".join(reply_chunks)

    history.append({
        "role": "assistant",
        "content": reply,
    })

    save_history(wa_id, history)

    await send_whatsapp_message(
        wa_id,
        reply,
    )
    
    
    

    