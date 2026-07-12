from app.dependencies.database_conn import get_pool
from app.repositories import analytics_repo, chatbot_repo, client_repo
from fastapi import HTTPException

async def get_analytics(owner_id: str, chatbot_id: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        client_id = await client_repo.get_or_create_client_id(conn, owner_id)
        owned = await chatbot_repo.verify_chatbot_owner(conn, chatbot_id, client_id)
        if not owned:
            raise HTTPException(status_code=404, detail="Chatbot not found")

        totals = await analytics_repo.get_conversation_and_duration_totals(conn, chatbot_id)
        total_messages = await analytics_repo.get_message_count(conn, chatbot_id)
        daily_volume = await analytics_repo.get_daily_volume(conn, chatbot_id)
        top_questions = await analytics_repo.get_top_questions(conn, chatbot_id)

    return {
        "total_conversations": totals["total_conversations"],
        "total_messages": total_messages,
        "total_duration_seconds": int(totals["total_duration_seconds"]),
        "daily_volume": [{"day": str(r["day"]), "count": r["count"]} for r in daily_volume],
        "top_questions": [dict(r) for r in top_questions],
    }
