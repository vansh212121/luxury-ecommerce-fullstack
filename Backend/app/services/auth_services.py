from sqlalchemy.orm import Session
from app.crud import user as user_crud
from app.core.security import verify_password
from app.models.user_model import User

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    # Step 1: Get the user from the database using our existing CRUD function.
    user = user_crud.get_user_by_email(db, email=email)
    
    # Check if a user was found and if the password is correct.
    if not user or not verify_password(password, user.hashed_password):
        # Authentication fails if no user or wrong password.
        return None
    
    # Step 2: If we get here, authentication is successful.
    return user
