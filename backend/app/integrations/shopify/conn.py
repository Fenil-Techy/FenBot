from app.core.config import settings
API_VERSION="2026-07"
BASE_URL=f"https://{settings.SHOPIFY_STORE_DOMAIN}/admin/api/{API_VERSION}/"
headers={
    "X-Shopify-Access-Token":settings.SHOPIFY_ACCESS_TOKEN,
    "Content-Type":"application/json"
}

    