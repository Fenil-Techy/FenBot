async def get_order_status(order_id:str):
    fake_db = {
        "ORD1234": "shipped, arriving in 2 days",
        "ORD5678": "processing, not yet shipped",
    }
    status=fake_db.get(order_id.upper(),"not found — please double-check the order ID")
    return f"{order_id}:{status}"