from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate(message:str)->str:
    response= await client.responses.create(
        model="gpt-4o-mini",
        input=message
    )
    
    return response.output_text