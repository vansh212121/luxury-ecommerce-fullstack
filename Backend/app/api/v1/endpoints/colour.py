# app/api/v1/endpoints/colours.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.product_schema import ColourResponse, ColourCreate
from app.utils import deps
from app.models.user_model import User
from app.services import colour_services

router = APIRouter()


@router.post("/", response_model=ColourResponse, status_code=status.HTTP_201_CREATED)
def create_colour_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    colour_in: ColourCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Creates a new colour. (Admin only)"""
    # Corrected variable and function names
    colour = colour_services.create_new_colour(
        db=db, colour_in=colour_in, current_user=current_user
    )
    return colour


@router.delete("/{colour_id}", status_code=status.HTTP_200_OK)
def delete_colour_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    colour_id: int,  # Corrected parameter name
    current_user: User = Depends(deps.get_current_active_user)
):
    """Deletes a Colour. (Admin only)"""
    colour_services.delete_colour_by_id(
        db=db,
        colour_id=colour_id,
        current_user=current_user,  # Corrected parameter name
    )
    return {"message": "Colour deleted successfully"}


@router.get("/", response_model=List[ColourResponse], status_code=status.HTTP_200_OK)
def get_all_colours_endpoint(db: Session = Depends(deps.get_db)):
    """Gets a list of all available colours."""
    # Corrected variable name
    colours = colour_services.get_all_colours(db=db)
    return colours
