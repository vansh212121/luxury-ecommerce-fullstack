# app/schemas/order.py

from pydantic import BaseModel
from typing import List
from datetime import datetime
import enum

# We need to import other response schemas to nest them.
from .product_schema import ProductResponse
from .user_schema import UserResponse


class OrderItemResponse(BaseModel):
    """
    Schema for displaying a single item within an order.
    """

    id: int
    quantity: int
    price_at_purchase: float
    product: ProductResponse

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    """
    Schema for displaying a full order to the client.
    This is used for the order confirmation and order history pages.
    """

    id: int
    total_amount: float
    status: str  # We'll use a string here for simplicity
    order_date: datetime
    items: List[OrderItemResponse]
    
    customer: UserResponse 

    class Config:
        from_attributes = True


class OrderStatus(str, enum.Enum):
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


# ... (OrderItemResponse and OrderResponse are unchanged) ...


class OrderUpdate(BaseModel):
    """
    Schema for updating an order's status.
    """

    status: OrderStatus
