# app/crud/dashboard.py

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.order_model import Order, OrderStatus
from app.models.product_model import Product
from app.models.user_model import User


def get_total_income(db: Session) -> float:
    """Calculates the sum of total_amount for all 'delivered' orders."""
    # func.sum() is a SQLAlchemy function for aggregation.
    # .scalar() returns a single value instead of a full row.
    total = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.status == OrderStatus.delivered)
        .scalar()
    )
    return total or 0.0  # Return 0.0 if there are no delivered orders


def get_total_sales_count(db: Session) -> int:
    """Counts the total number of 'delivered' orders."""
    count = (
        db.query(func.count(Order.id))
        .filter(Order.status == OrderStatus.delivered)
        .scalar()
    )
    return count or 0


def get_total_products_count(db: Session) -> int:
    """Counts the total number of products."""
    return db.query(func.count(Product.id)).scalar() or 0


def get_total_customers_count(db: Session) -> int:
    """Counts the total number of non-admin users."""
    return db.query(func.count(User.id)).filter(User.is_admin == False).scalar() or 0

