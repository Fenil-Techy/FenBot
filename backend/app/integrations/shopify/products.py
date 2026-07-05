
from app.integrations.shopify.conn import BASE_URL,headers
import httpx
async def get_product_info(product_name:str):
    async with httpx.AsyncClient() as client:
        response=await client.get(
            f"{BASE_URL}/products.json",
            params={
                "title":product_name,
                "limit":3
            },
            headers=headers
        )

        if response.status_code != 200:
             return f"Couldn't reach the store catalog (status {response.status_code})."

        products=response.json().get("products",[])
        if not products:
            return f"No products found matching '{product_name}'."
        
        summaries=[]
        for p in products:
            variant=p["variants"][0] if p.get("variants") else {}
            title=variant.get("title")
            price=variant.get("price","N/A")
            inventory_quantity=variant.get("inventory_quantity","unknown")
            summary=f"""
            Product title : {title}
            Price : ${price}
            Stock : {inventory_quantity}
            
            """
            summaries.append(summary)
        return "\n".join(summaries)