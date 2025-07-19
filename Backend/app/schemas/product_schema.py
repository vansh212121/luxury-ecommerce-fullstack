# app/schemas/product.py
from pydantic import BaseModel
from typing import List, Optional
import enum

# --- Enums for Validation ---
# Using enums makes the API contract clear and prevents invalid data.


class ProductGender(str, enum.Enum):
    men = "men"
    women = "women"
    unisex = "unisex"


class ProductStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


# --- Category Schemas ---


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True


# --- Size Schemas ---


class SizeBase(BaseModel):
    name: str


class SizeCreate(SizeBase):
    pass


class SizeResponse(SizeBase):
    id: int

    class Config:
        from_attributes = True


# --- Colour Schemas ---


class ColourBase(BaseModel):
    name: str
    hex_code: str


class ColourCreate(ColourBase):
    pass


class ColourResponse(ColourBase):
    id: int

    class Config:
        from_attributes = True


# --- Product Image Schemas ---


class ProductImageBase(BaseModel):
    image_url: str


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageResponse(ProductImageBase):
    id: int

    class Config:
        from_attributes = True


# --- Main Product Schemas ---


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    discount_price: Optional[float] = None
    stock: int
    brand: Optional[str] = None
    gender: ProductGender
    status: ProductStatus = ProductStatus.active  # Added status with a default


class ProductCreate(ProductBase):
    # When creating a product, we expect the IDs for the relationships
    category_id: int
    size_ids: List[int]
    colour_ids: List[int]
    images: List[ProductImageCreate]  # A list of image objects to be created


class ProductUpdate(BaseModel):
    """
    Schema for updating a product. All fields are optional.
    """

    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    stock: Optional[int] = None
    brand: Optional[str] = None
    gender: Optional[str] = None
    status: Optional[str] = None

    # We can also optionally update the relationships by providing new IDs
    category_id: Optional[int] = None
    size_ids: Optional[List[int]] = None
    colour_ids: Optional[List[int]] = None
    # Image updates would typically be handled by separate endpoints


class ProductResponse(ProductBase):
    id: int
    # When returning a product, we want to show the full nested objects
    category: CategoryResponse
    sizes: List[SizeResponse]
    colours: List[ColourResponse]
    images: List[ProductImageResponse]

    class Config:
        from_attributes = True

class ProductPageResponse(BaseModel):
    """A schema for returning a paginated list of products."""
    total: int
    items: List[ProductResponse]