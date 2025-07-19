from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.services import cart_services
from app.schemas.cart_schema import CartItemResponse, CartItemCreate, CartItemUpdate
from app.utils import deps
from app.models.user_model import User

router = APIRouter()


@router.post(
    "/items", status_code=status.HTTP_201_CREATED, response_model=CartItemResponse
)
def add_item_to_cart_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    # The endpoint now correctly expects the item details in the request body.
    cart_in: CartItemCreate,
    current_user: User = Depends(deps.get_current_active_user)
):

    cart_item = cart_services.add_item_to_cart(
        db=db, current_user=current_user, cart_in=cart_in
    )
    return cart_item


@router.patch("/items/{cart_item_id}", response_model=CartItemResponse)
def update_cart_item_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    cart_item_id: int,
    cart_in: CartItemUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    item = cart_services.update_cart_item_quantity(
        db=db, cart_item_id=cart_item_id, cart_in=cart_in, current_user=current_user
    )
    return item


@router.delete("/delete/{cart_item_id}", status_code=status.HTTP_200_OK)
def delete_cart_item(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    cart_item_id: int
):
    item = cart_services.delete_item_from_cart(
        db=db, cart_item_id=cart_item_id, current_user=current_user
    )

    return None


@router.get("/", response_model=List[CartItemResponse])
def get_all_cart_items_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):

    items = cart_services.get_user_cart_items(db=db, current_user=current_user)
    return items
