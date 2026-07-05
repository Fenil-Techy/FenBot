import logging
logger=logging.getLogger(__name__)

def extract_whatsapp_payload(body):
    try:
        entry=body["entry"][0]
        change=entry["changes"][0]["value"]
        if "messages" not in change:
            return None
        message=change["messages"][0]
        wa_id=message["from"]
        text=message["text"]["body"]

        return wa_id,text

    except (KeyError, IndexError) as e:
        logger.exception("Failed to parse WhatsApp payload")
        return None
