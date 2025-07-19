# app/db/init_db.py

from sqlalchemy.orm import Session
from app.crud import user as user_crud
from app.models.user_model import User, UserRole
from app.models.product_model import Category, Size, Colour
from app.core.security import get_password_hash
from app.db.session import SessionLocal

# --- Configuration for Superuser ---
FIRST_SUPERUSER_EMAIL = "admin@gmail.com"
FIRST_SUPERUSER_PASSWORD = "password"

# --- Configuration for Seed Data ---
INITIAL_CATEGORIES = ["Hoodies", "Caps", "Trousers", "Sneakers", "T-Shirts"]
INITIAL_SIZES = ["S", "M", "L", "XL", "XXL"]
INITIAL_COLOURS = [
    {"name": "Black", "hex_code": "#000000"},
    {"name": "White", "hex_code": "#FFFFFF"},
    {"name": "Red", "hex_code": "#FF0000"},
    {"name": "Blue", "hex_code": "#0000FF"},
]

def init_db(db: Session) -> None:
    """
    Initializes the database with a superuser and seed data.
    """
    # --- Create Superuser ---
    user = user_crud.get_user_by_email(db, email=FIRST_SUPERUSER_EMAIL)
    if not user:
        print("Creating first superuser")
        hashed_password = get_password_hash(FIRST_SUPERUSER_PASSWORD)
        user_in = User(
            email=FIRST_SUPERUSER_EMAIL, name="Admin User",
            hashed_password=hashed_password, is_active=True,
            is_admin=True, role=UserRole.admin
        )
        db.add(user_in)
        db.commit()
        print("Superuser created")
    else:
        print("Superuser already exists, skipping creation.")

    # --- Seed Categories ---
    if not db.query(Category).first():
        print("Seeding categories...")
        for cat_name in INITIAL_CATEGORIES:
            db.add(Category(name=cat_name))
        db.commit()
        print("Categories seeded.")
    else:
        print("Categories already exist, skipping seeding.")

    # --- Seed Sizes ---
    if not db.query(Size).first():
        print("Seeding sizes...")
        for size_name in INITIAL_SIZES:
            db.add(Size(name=size_name))
        db.commit()
        print("Sizes seeded.")
    else:
        print("Sizes already exist, skipping seeding.")

    # --- Seed Colours ---
    if not db.query(Colour).first():
        print("Seeding colours...")
        for colour_data in INITIAL_COLOURS:
            db.add(Colour(name=colour_data["name"], hex_code=colour_data["hex_code"]))
        db.commit()
        print("Colours seeded.")
    else:
        print("Colours already exist, skipping seeding.")


if __name__ == "__main__":
    print("Initializing database...")
    db = SessionLocal()
    try:
        init_db(db)
        print("Database initialization finished.")
    finally:
        db.close()
