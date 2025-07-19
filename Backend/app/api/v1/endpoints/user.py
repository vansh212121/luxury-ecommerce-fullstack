from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.utils import deps
from app.schemas.user_schema import UserCreate, UserResponse, UserUpdate
from app.services import user_services
from app.schemas.token_schema import Token

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user_endpoint(*, db: Session = Depends(deps.get_db), user_in: UserCreate):

    user = user_services.create_new_user(db=db, user_in=user_in)
    return user


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(deps.get_current_active_user)):
    """
    Get the profile for the currently logged-in user.
    """
    return current_user




@router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserResponse)
def get_user_by_id_endpoint(*, db: Session = Depends(deps.get_db), user_id: int):
    """
    API endpoint to get a single user by their ID.
    """
    user = user_services.get_user_by_id(db=db, user_id=user_id)
    return user


@router.patch("/update/{user_id}", status_code=status.HTTP_200_OK, response_model=UserResponse)
def update_user_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: UserUpdate,
    # Add the dependency to get the currently logged-in user.
    # This automatically protects the endpoint. If no valid token is provided,
    # it will return a 401 Unauthorized error.
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    API endpoint to update a user.
    - A user can only update their own profile.
    - An admin can update any user's profile.
    """
    # Pass the current_user to the service layer to handle authorization.
    user = user_services.update_existing_user(
        db=db, user_id=user_id, user_in=user_in, current_user=current_user
    )
    return user

