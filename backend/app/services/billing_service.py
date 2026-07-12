from app.dependencies.database_conn import get_pool
from app.repositories import billing_repo, client_repo
from fastapi import HTTPException

PLAN_LIMITS = {
    "free": {
        "label": "Free", "price_usd": "$0", "price_inr": "₹0",
        "conversation_limit": 100, "chatbot_limit": 1,
        "whatsapp_enabled": False, "shopify_enabled": False, "badge_required": True,
    },
    "starter": {
        "label": "Starter", "price_usd": "$19/mo", "price_inr": "₹799/mo",
        "conversation_limit": 500, "chatbot_limit": 1,
        "whatsapp_enabled": False, "shopify_enabled": False, "badge_required": False,
    },
    "growth": {
        "label": "Growth", "price_usd": "$49/mo", "price_inr": "₹1,999/mo",
        "conversation_limit": 2500, "chatbot_limit": 3,
        "whatsapp_enabled": True, "shopify_enabled": True, "badge_required": False,
    },
    "scale": {
        "label": "Scale", "price_usd": "Contact us", "price_inr": "Contact us",
        "conversation_limit": None, "chatbot_limit": None,
        "whatsapp_enabled": True, "shopify_enabled": True, "badge_required": False,
    },
}

async def get_billing(owner_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_row = await client_repo.get_client_row(conn, owner_id)
        if not client_row:
            raise HTTPException(status_code=404, detail="Client not found")

        client_id = client_row["id"]
        usage_this_month = await billing_repo.get_monthly_conversation_usage(conn, client_id)
        chatbot_count = await billing_repo.get_chatbot_count(conn, client_id)

    plan_info = PLAN_LIMITS.get(client_row["plan"], PLAN_LIMITS["free"])
    return {
        "current_plan": client_row["plan"],
        "plan_info": plan_info,
        "conversations_used": usage_this_month,
        "chatbots_used": chatbot_count,
        "all_plans": PLAN_LIMITS,
    }
