from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
import enum

class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"

class UserBase(BaseModel):
    name: str
    email: EmailStr

# --- Schemas for API Operations ---
class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    is_admin : bool
    is_active: Optional[bool] = True

    class Config:
        from_attributes = True
