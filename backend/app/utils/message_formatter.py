from app.schemas.chat import Message
from typing import List
def message_formatter(messages:List[Message]):
    formatted= []
    for msg in messages:
        text_parts=[
            part.text for part in msg.parts
            if part.type=="text"
        ]
        text=" ".join(text_parts)
        if text:
            formatted.append({
                "role": msg.role,
                "content": text
            })
    return formatted