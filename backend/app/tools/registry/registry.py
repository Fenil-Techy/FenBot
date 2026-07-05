from app.integrations.shopify.orders import get_order_status
from app.integrations.shopify.products import get_product_info


TOOL_FUNCTIONS={
    "get_order_status":get_order_status,
    "get_product_info":get_product_info
}
    