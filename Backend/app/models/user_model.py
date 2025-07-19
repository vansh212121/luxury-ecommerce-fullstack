from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLAlchemyEnum, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum
from sqlalchemy.orm import relationship


class UserRole(enum.Enum):
    user = "user"
    admin = "admin"

class User(Base):
    """
    SQLAlchemy model for a User.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    
    hashed_password = Column(String, nullable=False)
    

    role = Column(SQLAlchemyEnum(UserRole, name="userrole"), nullable=False, default=UserRole.user)
    
    is_admin = Column(Boolean(), default=False)
    is_active = Column(Boolean(), default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cart_items = relationship("CartItem", back_populates="owner", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="owner", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="customer")