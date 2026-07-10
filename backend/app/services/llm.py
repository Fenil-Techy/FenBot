from app.utils.follow_up_input import follow_up_input
from app.services.tool_executor import execute_tool
from app.tools.schema.shopify.tool_schema import TOOLS
from app.services.rag import retrieve
from app.prompts.prompt import SYSTEM_PROMPT_TEMPLATE
from openai import AsyncOpenAI
from app.core.config import settings
import logging

logger=logging.getLogger(__name__)

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate(messages:list,*,chatbot_id:str,persona:str,model="gpt-4o-mini",**kwargs):
    last_message=messages[-1]["content"]
    retrieved=await retrieve(last_message,chatbot_id=chatbot_id)
    logger.debug(retrieved)
    context="\n".join(f"-{chunk}" for chunk in retrieved) or "no relevant context found"
    system_prompt = f"{persona}\n\nContext:\n{context}"
    full_input=[{"role":"system","content":system_prompt},*messages]
    logger.debug(full_input)
    response= await client.responses.create(
        model=model,
        input=full_input,
        tools=TOOLS,
        stream=True,   
        **kwargs
    )
    
    function_call=None
    async for event in response:
        logger.debug(event.type)
        if event.type == "response.output_text.delta":
            yield event.delta
        elif event.type == "response.output_item.added":
            item=event.item
            if item.type=="function_call":
                function_call={"name":item.name,"call_id":item.call_id,"arguments":""}
        elif event.type == "response.function_call_arguments.delta":
            if function_call:
                function_call["arguments"]+=event.delta

    if function_call:
        tool_result=await execute_tool(function_call)
        logger.debug(tool_result)
        follow_up_messages=follow_up_input(full_input,function_call,tool_result)
        logger.debug(follow_up_messages)

        follow_up=await client.responses.create(
            model=model,
            input=follow_up_messages,
            stream=True,
            **kwargs
        )
       
        async for event in follow_up:
            logger.debug(event.type)
            if event.type=="response.output_text.delta":
                yield event.delta