# app/services/order_service.py

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.order_schema import OrderUpdate
from app.crud import order as order_crud
from app.crud import cart as cart_crud
from app.models.user_model import User
from app.models.order_model import Order
from typing import List


def create_order_from_cart(db: Session, current_user: User) -> Order:
    """
    The main business logic for creating an order from a user's cart.
    This is a transactional operation.
    """
    # 1. Get all items from the user's cart.
    cart_items = cart_crud.get_all_cart_items_for_user(db, user_id=current_user.id)
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an order from an empty cart.",
        )

    # 2. Calculate the total amount of the order.
    total_amount = sum(item.product.price * item.quantity for item in cart_items)

    # --- TRANSACTION START ---
    # Our get_db dependency handles the final commit or rollback.

    # 3. Create the main Order record.
    new_order = order_crud.create_order(
        db, user=current_user, total_amount=total_amount
    )

    # 4. Create an OrderItem for each item in the cart.
    for item in cart_items:
        order_crud.create_order_item(db, order=new_order, cart_item=item)

    # 5. Clear the user's cart.
    order_crud.clear_user_cart(db, user_id=current_user.id)

    # 6. Commit the transaction.
    db.commit()

    # --- TRANSACTION END ---

    return new_order


def get_user_order_history(db: Session, current_user: User) -> List[Order]:
    """
    Service to get the order history for the current user.
    """
    # Simply calls the CRUD function to fetch the orders.
    # An empty list is a valid response if the user has no orders.
    return order_crud.get_orders_by_user(db=db, user_id=current_user.id)


def get_all_orders_for_admin(db: Session, current_user: User) -> List[Order]:
    """Service to get all orders. (Admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return order_crud.get_all_orders(db=db)


def get_order_by_id_for_admin(db: Session, order_id: int, current_user: User) -> Order:
    """Service to get a single order by ID. (Admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    order = order_crud.get_order_by_id(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def update_order_status_for_admin(
    db: Session, order_id: int, order_in: OrderUpdate, current_user: User
) -> Order:
    """Service to update an order's status. (Admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    order_to_update = order_crud.get_order_by_id(db, order_id=order_id)
    if not order_to_update:
        raise HTTPException(status_code=404, detail="Order not found")

    # We can reuse our generic user update logic from the User CRUD
    # or create a dedicated one for orders. For now, a direct update is fine.
    order_to_update.status = order_in.status
    db.add(order_to_update)
    db.commit()
    db.refresh(order_to_update)
    return order_to_update
