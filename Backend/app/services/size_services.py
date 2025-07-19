# app/services/size_service.py

from sqlalchemy.orm import Session
from typing import List
from fastapi import status, HTTPException

from app.models.product_model import Size
from app.schemas.product_schema import SizeCreate
from app.models.user_model import User
from app.crud import size as size_crud


def create_new_size(db: Session, current_user: User, size_in: SizeCreate) -> Size:
    """Service to create a new size with authorization."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    existing_size = db.query(Size).filter(Size.name == size_in.name).first()
    if existing_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            # Corrected error message
            detail=f"Size '{size_in.name}' already exists.",
        )
    return size_crud.create_size(db=db, size_in=size_in)


def delete_size_by_id(db: Session, current_user: User, size_id: int) -> None:
    """Service to delete a size with authorization and existence checks."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    # Fetch the size to delete
    # Corrected parameter name from category_id to size_id
    size_to_delete = size_crud.get_size(db=db, size_id=size_id)
    if not size_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Size not found"
        )

    return size_crud.delete_size(db=db, db_obj=size_to_delete)


def get_all_sizes(db: Session) -> List[Size]:
    """Service to get all sizes."""
    return size_crud.get_all_sizes(db=db)
