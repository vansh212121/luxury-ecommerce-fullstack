# app/models/order.py
from sqlalchemy import Column, Integer, ForeignKey, Float, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class OrderStatus(enum.Enum):
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    total_amount = Column(Float, nullable=False)
    status = Column(SQLAlchemyEnum(OrderStatus, name="orderstatus"), nullable=False, default=OrderStatus.processing)
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign Key to link to the User
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship to access the User object
    customer = relationship("User", back_populates="orders")
    
    # Relationship to access the list of items in this order
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "orderitems"
    
    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False) # The price when the order was made
    
    # Foreign Keys to link to the Order and Product
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
