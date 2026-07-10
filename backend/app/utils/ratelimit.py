from fastapi import HTTPException
import time

_rate_buckets: dict[str, list[float]] = {}
RATE_LIMIT = 20          # max messages
RATE_WINDOW = 60         # per 60 seconds, per bot

def check_rate_limit(chatbot_id: str):
    now = time.time()
    bucket = _rate_buckets.setdefault(chatbot_id, [])
    bucket[:] = [t for t in bucket if now - t < RATE_WINDOW]
    if len(bucket) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many messages, slow down.")
    bucket.append(now)