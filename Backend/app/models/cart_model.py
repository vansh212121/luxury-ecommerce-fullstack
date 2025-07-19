from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class CartItem(Base):
    __tablename__ = "cartitems"
    
    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    size_id = Column(Integer, ForeignKey("sizes.id"), nullable=False)
    colour_id = Column(Integer, ForeignKey("colours.id"), nullable=False)
    
    owner = relationship("User", back_populates="cart_items")
    product = relationship("Product") 
    size = relationship("Size")
    colour = relationship("Colour")