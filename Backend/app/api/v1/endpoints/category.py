# app/api/v1/endpoints/categories.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.product_schema import CategoryResponse, CategoryCreate
from app.utils import deps
from app.models.user_model import User
from app.services import category_services

router = APIRouter()


# Best practice: POST on the collection name ('/') to create a new item.
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    category_in: CategoryCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Creates a new category. (Admin only)"""
    category = category_services.create_new_category(
        db=db, category_in=category_in, current_user=current_user
    )
    return category


# Best practice: DELETE on the specific item's ID.
@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def delete_category_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    # Corrected the dependency syntax here
    current_user: User = Depends(deps.get_current_active_user)
):
    """Deletes a category. (Admin only)"""
    category_services.delete_category_by_id(
        db=db, category_id=category_id, current_user=current_user
    )
    return {"message": "Category deleted successfully"}


# This is a public endpoint, so no user dependency is needed.
@router.get("/", response_model=List[CategoryResponse], status_code=status.HTTP_200_OK)
def get_all_categories_endpoint(db: Session = Depends(deps.get_db)):
    """Gets a list of all available categories."""
    categories = category_services.get_all_categories(db=db)
    return categories
