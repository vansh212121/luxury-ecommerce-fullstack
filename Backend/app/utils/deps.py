from typing import Generator, Optional
from app.db.session import SessionLocal
from sqlalchemy.orm import Session
from fastapi import Depends, status, HTTPException
from app.models.user_model import User
from app.schemas.token_schema import TokenData
from app.crud import user as user_crud
from jose import JWTError
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from app.core.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")



def get_db() -> Generator:
    """
    FastAPI dependency that provides a SQLAlchemy database session.
    It ensures the session is always closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """
    Dependency to get the current user from a JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(sub=email)
    except JWTError:
        raise credentials_exception
    
    user = user_crud.get_user_by_email(db, email=token_data.sub)
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency that builds on get_current_user to also check
    if the user is active. This is the one most endpoints will use.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user


def get_optional_current_user(
    db: Session = Depends(get_db), token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    """
    An optional dependency to get the current user.
    If no token is provided, returns None instead of raising an error.
    """
    if not token:
        return None
    try:
        # We can reuse our existing get_current_user logic here
        return get_current_user(db=db, token=token)
    except HTTPException:
        # If the token is invalid, treat it as if no user is logged in.
        return None
