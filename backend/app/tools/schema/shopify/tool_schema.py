TOOLS = [
    {
        "type": "function",
        "name": "get_order_status",
        "description": "Look up the current status of a customer's order using their order number.",
        "parameters": {
            "type": "object",
            "properties": {
                "order_number": {
                    "type": "string",
                    "description": "The order number, e.g. 1001 or #1001"
                }
            },
            "required": ["order_number"]
        }
    },
    {
        "type": "function",
        "name": "get_product_info",
        "description": "Search the store catalog for a product by name and return price and stock info.",
        "parameters": {
            "type": "object",
            "properties": {
                "product_name": {
                    "type": "string",
                    "description": "The product name or a keyword from it, e.g. 'blue t-shirt'"
                }
            },
            "required": ["product_name"]
        }
    }
]