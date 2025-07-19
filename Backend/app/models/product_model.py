from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum as SQLAlchemyEnum,
    Float,
    DateTime,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

# This table connects Products and Sizes
product_sizes_table = Table(
    "product_sizes",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("products.id"), primary_key=True),
    Column("size_id", Integer, ForeignKey("sizes.id"), primary_key=True),
)

# This table connects Products and Colours
product_colours_table = Table(
    "product_colours",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("products.id"), primary_key=True),
    Column("colour_id", Integer, ForeignKey("colours.id"), primary_key=True),
)


# --- Enums for specific fields ---
class ProductGender(enum.Enum):
    men = "men"
    women = "women"
    unisex = "unisex"


class ProductStatus(enum.Enum):
    active = "active"
    inactive = "inactive"


# --- Main Models ---


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    products = relationship("Product", back_populates="category")


class Size(Base):
    __tablename__ = "sizes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(
        String, unique=True, index=True, nullable=False
    )  # e.g., "S", "M", "L"


class Colour(Base):
    __tablename__ = "colours"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(
        String, unique=True, index=True, nullable=False
    )  # e.g., "Red", "Blue"
    hex_code = Column(String(7), nullable=False)  # e.g., "#FF0000"


class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product = relationship("Product", back_populates="images")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)  # Optional sale price
    stock = Column(Integer, nullable=False, default=0)
    brand = Column(String, index=True, nullable=True)

    gender = Column(SQLAlchemyEnum(ProductGender, name="productgender"), nullable=False)
    status = Column(
        SQLAlchemyEnum(ProductStatus, name="productstatus"),
        nullable=False,
        default=ProductStatus.active,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # --- Relationships ---
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")

    images = relationship(
        "ProductImage", back_populates="product", cascade="all, delete-orphan"
    )

    # Many-to-Many relationships defined using the association tables
    sizes = relationship("Size", secondary=product_sizes_table, backref="products")
    colours = relationship(
        "Colour", secondary=product_colours_table, backref="products"
    )

    wishlisted_by = relationship("WishlistItem", back_populates="product")
