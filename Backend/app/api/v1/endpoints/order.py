# app/api/v1/endpoints/orders.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.services import order_services
from app.schemas.order_schema import OrderResponse, OrderUpdate
from app.utils import deps
from app.models.user_model import User
from typing import List

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Creates a new order from the current user's shopping cart.
    """
    order = order_services.create_order_from_cart(db=db, current_user=current_user)
    return order


@router.get("/me", response_model=List[OrderResponse])
def get_my_orders_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Gets the order history for the currently logged-in user.
    """
    orders = order_services.get_user_order_history(db=db, current_user=current_user)
    return orders


@router.get("/admin/", response_model=List[OrderResponse])
def get_all_orders_endpoint(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Gets all orders for the admin panel."""
    return order_services.get_all_orders_for_admin(db=db, current_user=current_user)


@router.get("/admin/{order_id}", response_model=OrderResponse)
def get_single_order_endpoint(
    order_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Gets a single order by its ID for the admin panel."""
    return order_services.get_order_by_id_for_admin(
        db=db, order_id=order_id, current_user=current_user
    )


@router.patch("/admin/{order_id}", response_model=OrderResponse)
def update_order_status_endpoint(
    order_id: int,
    order_in: OrderUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Updates an order's status (e.g., to 'shipped')."""
    return order_services.update_order_status_for_admin(
        db=db, order_id=order_id, order_in=order_in, current_user=current_user
    )
