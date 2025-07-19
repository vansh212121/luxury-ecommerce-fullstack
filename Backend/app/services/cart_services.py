from sqlalchemy.orm import Session
from app.crud import cart as cart_crud
from app.schemas.cart_schema import CartItemCreate, CartItemUpdate
from app.models.user_model import User
from app.models.cart_model import CartItem
from fastapi import status, HTTPException
from typing import List

def add_item_to_cart(
    db: Session, current_user: User, cart_in: CartItemCreate
) -> CartItem:
    # 1. Use our CRUD tool to check for an existing item.
    existing_item = cart_crud.get_existing_cart_item(
        db=db,
        user_id=current_user.id,
        product_id=cart_in.product_id,
        size_id=cart_in.size_id,
        colour_id=cart_in.colour_id,
    )

    # 2. Make the decision.
    if existing_item:
        # If it exists, update the quantity and save.
        existing_item.quantity += cart_in.quantity
        db.add(existing_item)
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # If it doesn't exist, call the "create" CRUD tool.
        return cart_crud.create_cart_item(
            db=db, user_id=current_user.id, cart_in=cart_in
        )


def update_cart_item_quantity(
    db: Session, cart_item_id: int, cart_in: CartItemUpdate, current_user: User
) -> CartItem:
    # 1. Fetch the item using the corrected CRUD function.
    item_to_update = cart_crud.get_cart_item(db=db, cart_item_id=cart_item_id)
    if not item_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            # Corrected error message for clarity.
            detail=f"Cart item with ID {cart_item_id} not found."
        )

    # 2. Authorization: Ensure the user owns this cart item.
    if item_to_update.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this item."
        )

    # 3. Prepare the update data.
    update_data = cart_in.model_dump()

    # 4. Call the corrected CRUD update function.
    return cart_crud.update_cart_item(db=db, db_obj=item_to_update, obj_in=update_data)


def delete_item_from_cart(
    db: Session, cart_item_id: int, current_user: User
) -> None:
    """
    Business logic to delete an item from a user's cart.
    """
    # 1. Fetch the item to be deleted.
    item_to_delete = cart_crud.get_cart_item(db=db, cart_item_id=cart_item_id)
    if not item_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart item with ID {cart_item_id} not found."
        )

    # 2. Authorization: Ensure the user owns this cart item.
    if item_to_delete.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item."
        )

    # 3. Call the simple CRUD function to perform the deletion.
    return cart_crud.delete_cart_item(db=db, db_obj=item_to_delete)

def get_user_cart_items(db: Session, current_user: User) -> List[CartItem]:
    """
    Service to get all cart items for the current user.
    """
    # The service simply calls the appropriate CRUD function.
    return cart_crud.get_all_cart_items_for_user(db=db, user_id=current_user.id)
