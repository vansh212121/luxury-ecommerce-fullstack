# app/api/v1/endpoints/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.utils import deps
from app.services import auth_services
from app.core.security import create_access_token
from app.schemas.token_schema import Token

router = APIRouter()

@router.post("/token", response_model=Token)
def login_for_access_token(
    db: Session = Depends(deps.get_db),
    # Use the special OAuth2PasswordRequestForm dependency.
    # It gets `username` and `password` from the request body.
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Handles user login and returns a JWT access token.
    This is the endpoint Swagger UI's "Authorize" button will use.
    """
    # Step 1: Call the authentication service.
    # We pass form_data.username as the email.
    user = auth_services.authenticate_user(
        db=db, email=form_data.username, password=form_data.password
    )

    # Step 2: Handle failed authentication.
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Step 3: If authentication is successful, create the access token.
    # The 'sub' (subject) of the token is the user's email.
    access_token = create_access_token(
        data={"sub": user.email}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
