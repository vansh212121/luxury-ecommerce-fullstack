# app/services/wishlist_service.py

from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status

from app.models.wishlist_model import WishlistItem
from app.schemas.wishlist_schema import WishlistItemCreate
from app.models.user_model import User
from app.crud import wishlist as wishlist_crud
from app.crud import product as product_crud # We need this to check if product exists

def add_item_to_wishlist(
    db: Session, wishlist_in: WishlistItemCreate, current_user: User
) -> WishlistItem:
    """Service to add a new item to the user's wishlist."""
    # Step 1: Validate that the product the user wants to add actually exists.
    product = product_crud.get_product(db, product_id=wishlist_in.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Step 2: Check if the item is already in the user's wishlist.
    existing_item = wishlist_crud.get_existing_wishlist_item(
        db=db, user_id=current_user.id, product_id=wishlist_in.product_id
    )
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already in Wishlist",
        )
    
    # Step 3: If all checks pass, call the CRUD function to create the item.
    return wishlist_crud.create_wishlist_item(
        db=db, user_id=current_user.id, product_id=wishlist_in.product_id
    )

def delete_item_from_wishlist(
    db: Session, wishlist_item_id: int, current_user: User
) -> None:
    """Service to delete an item from the user's wishlist."""
    item_to_delete = wishlist_crud.get_wishlist_item_by_id(
        db=db, wishlist_item_id=wishlist_item_id
    )
    if not item_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Wishlist item with ID {wishlist_item_id} not found.",
        )

    if item_to_delete.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item.",
        )

    return wishlist_crud.delete_wishlist_item(db=db, db_obj=item_to_delete)

def get_user_wishlist(db: Session, current_user: User) -> List[WishlistItem]:
    """Service to get all of a user's wishlist items."""
    return wishlist_crud.get_all_wishlist_items_for_user(db=db, user_id=current_user.id)
