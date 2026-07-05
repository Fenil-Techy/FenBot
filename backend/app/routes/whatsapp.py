from app.integrations.whatsapp.service import process_whatsapp_webhook
from app.core.config import settings
from fastapi import APIRouter,Request,Response

import logging
logger=logging.getLogger(__name__)
router=APIRouter()

@router.get("/webhook/whatsapp")
async def verify_webhook(request:Request):
    params=request.query_params
    mode=params.get("hub.mode")
    token=params.get("hub.verify_token")
    challenge=params.get("hub.challenge")
    
    if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
        return Response(content=challenge,media_type="text/plain")
    return Response(content="Verification failed",status_code=403)

@router.post("/webhook/whatsapp")
async def receive_whatsapp_message(request:Request):
    body=await request.json()
    logger.info(body)
    await process_whatsapp_webhook(body)

    return Response(status_code=200)