from app.integrations.shopify.conn import headers
from app.integrations.shopify.conn import BASE_URL
import httpx
async def get_order_status(order_number:str):
    name_query=order_number if order_number.startswith("#") else f"#{order_number}"

    async with httpx.AsyncClient() as client:
        response= await client.get(
            f"{BASE_URL}/orders.json",
            headers=headers,
            params={
                "name":name_query,
                "status":"any"
            }
        )

        if response.status_code != 200:
            return f"Couldn't reach the order system (status {response.status_code})."
        
        orders=response.json().get("orders",[])
        if not orders:
            return f"I couldn't find an order with that number - {order_number}. Could you check the number?"
        
        order=orders[0]
        order_name=order.get("name")
        status=order.get("fulfillment_status","unknown")
        created_at=order.get("created_at")
        total_price=order.get("total_price")
        currency=order.get("currency")
        financial_status=order.get("financial_status")

        return (
            f"Order {order_name} status:\n"
            f"Status: {status}\n"
            f"Financial Status: {financial_status}\n"
            f"Total Price: {total_price} {currency}\n"
            f"Created at: {created_at}\n"
        )

    