# app/crud/order.py

from sqlalchemy.orm import Session
from typing import List

from app.models.order_model import Order, OrderItem
from app.models.cart_model import CartItem
from app.models.user_model import User


def create_order(db: Session, user: User, total_amount: float) -> Order:
    """Creates the main Order record."""
    db_order = Order(customer=user, total_amount=total_amount)
    db.add(db_order)
    # We don't commit yet! The service will handle the final commit.
    db.flush()  # flush sends the data to the DB to get the ID, but doesn't commit.
    db.refresh(db_order)
    return db_order


def create_order_item(db: Session, order: Order, cart_item: CartItem) -> OrderItem:
    """Creates a single OrderItem record from a CartItem."""
    db_order_item = OrderItem(
        order=order,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        price_at_purchase=cart_item.product.price,  # Get price from the product relationship
    )
    db.add(db_order_item)
    return db_order_item


def clear_user_cart(db: Session, user_id: int) -> None:
    """Deletes all cart items for a specific user."""
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    return None


def get_orders_by_user(db: Session, user_id: int) -> List[Order]:
    """
    Gets all orders placed by a specific user.
    """
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.order_date.desc())
        .all()
    )


def get_order_by_id(db: Session, order_id: int) -> Order | None:
    """Gets a single order by its primary key ID."""
    return db.query(Order).filter(Order.id == order_id).first()


def get_all_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
    """Gets all orders, with pagination. For admin use."""
    return (
        db.query(Order)
        .order_by(Order.order_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
