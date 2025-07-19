# app/crud/size.py

from sqlalchemy.orm import Session
from typing import List
from app.models.product_model import Size
from app.schemas.product_schema import SizeCreate


def create_size(db: Session, size_in: SizeCreate) -> Size:
    """Creates a new size in the database."""
    size = Size(name=size_in.name)
    db.add(size)
    db.commit()
    db.refresh(size)
    return size


def get_size(db: Session, size_id: int) -> Size | None:
    """Gets a single size by its ID."""
    return db.query(Size).filter(Size.id == size_id).first()


def get_all_sizes(db: Session) -> List[Size]:
    """Gets all sizes from the database."""
    return db.query(Size).all()


def delete_size(db: Session, db_obj: Size) -> None:
    """Deletes a given size object from the database."""
    db.delete(db_obj)
    db.commit()
    return None
