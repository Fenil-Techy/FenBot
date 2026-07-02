from app.services.prompt import SYSTEM_PROMPT
from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate(messages:list,*,system_prompt=SYSTEM_PROMPT,model="gpt-4o-mini",**kwargs):
    response= await client.responses.create(
        model=model,
        input=[{"role":"system","content":system_prompt},*messages],
        stream=True,   
        **kwargs
    )
    async for event in response:
        if event.type == "response.output_text.delta":
            yield event.delta