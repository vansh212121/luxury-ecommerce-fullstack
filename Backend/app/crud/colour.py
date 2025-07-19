# app/crud/colour.py

from sqlalchemy.orm import Session
from typing import List
from app.models.product_model import Colour
from app.schemas.product_schema import ColourCreate

def create_colour(db: Session, colour_in: ColourCreate) -> Colour:
    """Creates a new colour in the database."""
    colour = Colour(name=colour_in.name, hex_code=colour_in.hex_code)
    db.add(colour)
    db.commit()
    db.refresh(colour)
    return colour

def get_colour(db: Session, colour_id: int) -> Colour | None:
    """Gets a single colour by its ID."""
    return db.query(Colour).filter(Colour.id == colour_id).first()

def get_all_colours(db: Session) -> List[Colour]:
    """Gets all colours from the database."""
    return db.query(Colour).all()

def delete_colour(db: Session, db_obj: Colour) -> None:
    """Deletes a given colour object from the database."""
    db.delete(db_obj)
    db.commit()
    return None