from sqlalchemy.orm import Session
from app.models.cart_model import CartItem
from app.schemas.cart_schema import CartItemCreate
from typing import Dict, Any, List

def get_existing_cart_item(
    db: Session, user_id: int, product_id: int, size_id: int, colour_id: int
) -> CartItem | None:
    return (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id,
            CartItem.size_id == size_id,
            CartItem.colour_id == colour_id,
        )
        .first()
    )

def create_cart_item(db: Session, user_id: int, cart_in: CartItemCreate) -> CartItem:
    db_item = CartItem(
        user_id=user_id,
        product_id=cart_in.product_id,
        size_id=cart_in.size_id,
        colour_id=cart_in.colour_id,
        quantity=cart_in.quantity,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_cart_item(db: Session, cart_item_id: int) -> CartItem | None:
    return db.query(CartItem).filter(CartItem.id == cart_item_id).first()

def update_cart_item(db: Session, db_obj: CartItem, obj_in: Dict[str, Any]) -> CartItem:
    for field, value in obj_in.items():
        if value is not None:
            setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_cart_item(db: Session, db_obj: CartItem) -> None:
    """
    Deletes a given cart item object from the database.
    """
    db.delete(db_obj)
    db.commit()
    return None



def get_all_cart_items_for_user(db: Session, user_id: int) -> List[CartItem]:
    """
    Gets all cart items for a specific user.
    """
    return db.query(CartItem).filter(CartItem.user_id == user_id).all()
