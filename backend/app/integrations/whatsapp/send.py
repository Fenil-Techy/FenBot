from app.services.llm import client
from app.integrations.whatsapp.conn import headers,BASE_URL
import httpx
import logging
logger=logging.getLogger(__name__)
async def send_whatsapp_message(to:str,text:str):
    logger.info("sending message")
    payload={
        "messaging_product":"whatsapp",
        "recipient_type":"individual",
        "to":to,
        "type":"text",
        "text":{
            "body":text
        }
    }
    async with httpx.AsyncClient() as client:
        logger.info("URL: %s", BASE_URL)
        logger.info("headers: %s", headers)
        response=await client.post(BASE_URL,headers=headers,json=payload)
        if response.status_code != 200:
            logger.error(f"Failed to send whatsapp message {response.status_code}{response.text}")
        logger.info("Status: %d", response.status_code)
        logger.info("Body: %s", response.text)
        return response


    