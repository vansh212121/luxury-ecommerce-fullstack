
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class WishlistItem(Base):
    """
    Represents a single product that a user has added to their wishlist.
    """
    __tablename__ = "wishlistitems"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # --- Foreign Keys ---
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # --- Relationships ---
    owner = relationship("User", back_populates="wishlist_items")
    product = relationship("Product", back_populates="wishlisted_by")