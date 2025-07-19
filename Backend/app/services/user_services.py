from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud import user as user_crud
from app.schemas.user_schema import UserCreate, UserUpdate
from app.core.security import get_password_hash
from app.models.user_model import User

def create_new_user(db: Session, user_in: UserCreate) -> User:
    # 1. Check if a user with this email already exists
    user = user_crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists.",
        )

    # 2. Hash the user's plain-text password
    hashed_password = get_password_hash(user_in.password)

    # 3. Call the CRUD function to create the user in the database
    return user_crud.create_user(db, user_in=user_in, hashed_password=hashed_password)


def get_user_by_id(db: Session, user_id: int) -> User:

    user = user_crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found.",
        )
    return user


def update_existing_user(
    db: Session, user_id: int, user_in: UserUpdate, current_user: User
) -> User:
    """
    Business logic to update a user, including authorization checks.
    """
    # 1. Get the user record that needs to be updated
    user_to_update = user_crud.get_user(db, user_id=user_id)
    if not user_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    # 2. --- AUTHORIZATION CHECK ---
    # Check if the logged-in user is trying to edit their own profile
    # OR if they are an admin.
    if user_to_update.id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user."
        )

    # 3. Create a dictionary of fields to update
    update_data = user_in.model_dump(exclude_unset=True)

    # 4. If a new password is provided, hash it securely
    if "password" in update_data and update_data["password"]:
        hashed_password = get_password_hash(update_data["password"])
        update_data["hashed_password"] = hashed_password
        del update_data["password"]

    # 5. Call the clean CRUD function to perform the update
    return user_crud.update_user(db=db, db_obj=user_to_update, obj_in=update_data)