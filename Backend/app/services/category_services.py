from sqlalchemy.orm import Session
from typing import List
from fastapi import status, HTTPException
from app.models.product_model import Category
from app.schemas.product_schema import CategoryCreate
from app.models.user_model import User
from app.crud import category as category_crud


def create_new_category(
    db: Session, current_user: User, category_in: CategoryCreate
) -> Category:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )
    # Check if category already exists
    existing_category = (
        db.query(Category).filter(Category.name == category_in.name).first()
    )
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{category_in.name}' already exists.",
        )
    return category_crud.create_category(db=db, category_in=category_in)


def delete_category_by_id(db: Session, current_user: User, category_id: int) -> None:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    # 1. Fetch the category ONCE.
    category_to_delete = category_crud.get_category(db=db, category_id=category_id)
    if not category_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )

    return category_crud.delete_category(db=db, db_obj=category_to_delete)


def get_all_categories(db: Session) -> List[Category]:
    return category_crud.get_all_categories(db=db)
