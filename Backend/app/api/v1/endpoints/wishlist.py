from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.services import wishlist_services
from app.schemas.wishlist_schema import WishlistItemCreate, WishlistItemResponse
from app.utils import deps
from app.models.user_model import User

router = APIRouter()


@router.post(
    "/", response_model=WishlistItemResponse, status_code=status.HTTP_201_CREATED
)
def add_to_wishlist_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_in: WishlistItemCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Adds a product to the current user's wishlist."""
    item = wishlist_services.add_item_to_wishlist(
        db=db, wishlist_in=wishlist_in, current_user=current_user
    )
    return item


@router.delete("/{wishlist_item_id}", status_code=status.HTTP_200_OK)
def delete_from_wishlist_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    wishlist_item_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Deletes an item from the current user's wishlist."""
    wishlist_services.delete_item_from_wishlist(
        db=db, wishlist_item_id=wishlist_item_id, current_user=current_user
    )
    return {"message": "Item removed from wishlist successfully"}


@router.get("/", response_model=List[WishlistItemResponse])
def get_wishlist_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Gets all items in the current user's wishlist."""
    items = wishlist_services.get_user_wishlist(db=db, current_user=current_user)
    return items
