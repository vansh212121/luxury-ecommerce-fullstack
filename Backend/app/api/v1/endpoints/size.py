# app/api/v1/endpoints/sizes.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.product_schema import SizeResponse, SizeCreate
from app.utils import deps
from app.models.user_model import User
from app.services import size_services  # Corrected import name

router = APIRouter()


@router.post("/", response_model=SizeResponse, status_code=status.HTTP_201_CREATED)
def create_size_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    size_in: SizeCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Creates a new size. (Admin only)"""
    # Corrected function and variable names
    size = size_services.create_new_size(
        db=db, size_in=size_in, current_user=current_user
    )
    return size


@router.delete("/{size_id}", status_code=status.HTTP_200_OK)
def delete_size_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    size_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Deletes a size. (Admin only)"""
    size_services.delete_size_by_id(db=db, size_id=size_id, current_user=current_user)
    return {"message": "Size deleted successfully"}


@router.get("/", response_model=List[SizeResponse], status_code=status.HTTP_200_OK)
def get_all_sizes_endpoint(db: Session = Depends(deps.get_db)):
    """Gets a list of all available sizes."""
    # Corrected variable name
    sizes = size_services.get_all_sizes(db=db)
    return sizes
