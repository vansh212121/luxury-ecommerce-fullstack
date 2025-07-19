# app/services/colour_service.py

from sqlalchemy.orm import Session
from typing import List
from fastapi import status, HTTPException

from app.models.product_model import Colour
from app.schemas.product_schema import ColourCreate
from app.models.user_model import User
from app.crud import colour as colour_crud


def create_new_colour(
    db: Session, current_user: User, colour_in: ColourCreate
) -> Colour:
    """Service to create a new colour with authorization."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    # Check if colour name or hex code already exists to prevent duplicates
    existing_colour = (
        db.query(Colour)
        .filter(
            (Colour.name == colour_in.name) | (Colour.hex_code == colour_in.hex_code)
        )
        .first()
    )
    if existing_colour:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Colour '{colour_in.name}' or hex code '{colour_in.hex_code}' already exists.",
        )
    return colour_crud.create_colour(db=db, colour_in=colour_in)


def delete_colour_by_id(db: Session, current_user: User, colour_id: int) -> None:
    """Service to delete a colour with authorization and existence checks."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    # Corrected function call to use get_colour
    colour_to_delete = colour_crud.get_colour(db=db, colour_id=colour_id)
    if not colour_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Colour not found"
        )

    return colour_crud.delete_colour(db=db, db_obj=colour_to_delete)


def get_all_colours(db: Session) -> List[Colour]:
    """Service to get all colours."""
    return colour_crud.get_all_colours(db=db)
