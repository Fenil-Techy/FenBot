TOOLS = [
    {
        "type": "function",
        "name": "get_order_status",
        "description": "Look up the current shipping status of a customer's order using their order ID.",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The customer's order ID, e.g. ORD1234"
                }
            },
            "required": ["order_id"]
        }
    }
]