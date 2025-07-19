# app/schemas/cart.py

from pydantic import BaseModel, Field
from .product_schema import ProductResponse, SizeResponse, ColourResponse


# --- Base Schema ---
class CartItemBase(BaseModel):
    quantity: int = Field(..., gt=0)  # Quantity must be a positive integer


# --- Schemas for API Operations ---


class CartItemCreate(BaseModel):
    product_id: int
    size_id: int
    colour_id: int
    quantity: int = Field(..., gt=0)  # Must be at least 1


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0)  # Must be at least 1


class CartItemResponse(CartItemBase):
    id: int

    # These are the nested schemas that provide rich information.
    product: ProductResponse
    size: SizeResponse
    colour: ColourResponse

    class Config:
        from_attributes = True
