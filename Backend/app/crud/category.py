from sqlalchemy.orm import Session
from typing import List
from app.models.product_model import Category
from app.schemas.product_schema import CategoryCreate


def create_category(db: Session, category_in: CategoryCreate) -> Category:
    category = Category(name=category_in.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_category(db: Session, category_id: int) -> Category | None:
    return db.query(Category).filter(Category.id == category_id).first()


def get_all_categories(db: Session) -> List[Category]:
    return db.query(Category).all()


def delete_category(db: Session, db_obj: Category) -> None:
    db.delete(db_obj)
    db.commit()
    # A delete operation typically returns nothing (None).
    return None
