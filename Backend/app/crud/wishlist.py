# app/crud/wishlist.py

from sqlalchemy.orm import Session
from typing import List
from app.models.wishlist_model import WishlistItem

def get_existing_wishlist_item(
    db: Session, user_id: int, product_id: int
) -> WishlistItem | None:
    """Finds if a user has already wishlisted a specific product."""
    return (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id)
        .first()
    )

def create_wishlist_item(db: Session, user_id: int, product_id: int) -> WishlistItem:
    """Creates a new wishlist item record."""
    # We assign the integer IDs directly to the columns.
    db_item = WishlistItem(user_id=user_id, product_id=product_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_wishlist_item_by_id(db: Session, wishlist_item_id: int) -> WishlistItem | None:
    """Gets a single wishlist item by its primary key ID."""
    return db.query(WishlistItem).filter(WishlistItem.id == wishlist_item_id).first()

def delete_wishlist_item(db: Session, db_obj: WishlistItem) -> None:
    """Deletes a given wishlist item object."""
    db.delete(db_obj)
    db.commit()
    return None

def get_all_wishlist_items_for_user(db: Session, user_id: int) -> List[WishlistItem]:
    """Gets all wishlist items for a specific user."""
    return db.query(WishlistItem).filter(WishlistItem.user_id == user_id).all()
