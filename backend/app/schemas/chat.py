from pydantic import BaseModel
from typing import List, Optional


class Part(BaseModel):
    type: str
    text: Optional[str] = None


class Message(BaseModel):
    role: str
    parts: List[Part]
    id: Optional[str] = None


class chatRequest(BaseModel):
    messages: List[Message]
    visitor_id: Optional[str] = None