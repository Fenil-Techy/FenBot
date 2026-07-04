import json
import logging

from app.tools.registry.registry import TOOL_FUNCTIONS

logger = logging.getLogger(__name__)


async def execute_tool(function_call):
    logger.info("Executing tool")

    logger.debug("Function call: %s", function_call)

    args = json.loads(function_call["arguments"] or "{}")
    logger.debug("Arguments: %s", args)

    tool_name = function_call["name"]

    logger.debug("Requested tool: %s", tool_name)
    logger.debug("Available tools: %s", list(TOOL_FUNCTIONS.keys()))

    tool_fn = TOOL_FUNCTIONS.get(tool_name)

    if tool_fn is None:
        logger.error("Tool '%s' not found", tool_name)
        return "Tool not found"

    result = await tool_fn(**args)

    logger.debug("Tool result: %s", result)

    return result