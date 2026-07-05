
from app.core.config import settings

GRAPH_API_VERSION="v25.0"
BASE_URL=f"https://graph.facebook.com/{GRAPH_API_VERSION}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
headers={
    "Authorization":f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
    "Content-Type":"application/json"
}