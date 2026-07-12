async def get_conversation_and_duration_totals(conn, chatbot_id: str):
    return await conn.fetchrow(
        """
        SELECT
            count(*) as total_conversations,
            coalesce(sum(extract(epoch from (last_message_at - started_at))), 0) as total_duration_seconds
        FROM conversations WHERE chatbot_id = $1
        """,
        chatbot_id
    )

async def get_message_count(conn, chatbot_id: str):
    return await conn.fetchval(
        """
        SELECT count(*) FROM messages m
        JOIN conversations co ON co.id = m.conversation_id
        WHERE co.chatbot_id = $1
        """,
        chatbot_id
    )

async def get_daily_volume(conn, chatbot_id: str):
    return await conn.fetch(
        """
        SELECT date(started_at) as day, count(*) as count
        FROM conversations
        WHERE chatbot_id = $1 AND started_at >= now() - interval '14 days'
        GROUP BY date(started_at)
        ORDER BY day ASC
        """,
        chatbot_id
    )

async def get_top_questions(conn, chatbot_id: str):
    return await conn.fetch(
        """
        SELECT lower(trim(m.content)) as question, count(*) as count
        FROM messages m
        JOIN conversations co ON co.id = m.conversation_id
        WHERE co.chatbot_id = $1 AND m.role = 'user'
        GROUP BY lower(trim(m.content))
        ORDER BY count DESC
        LIMIT 10
        """,
        chatbot_id
    )
