"""
User model.

A User is a company owner who signs up on BharatMCP.

Example:
    User(
        email="harsh@invoiceapp.com",
        name="Harsh",
        company_name="InvoiceApp",
        hashed_password="$2b$12$..."
    )

MongoDB collection: users
"""

from datetime import datetime
from typing import Optional

from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field


# ==========================================
# Database Document (stored in MongoDB)
# ==========================================

class User(Document):
    """Company owner account."""

    email: Indexed(str, unique=True)
    name: str
    company_name: str
    hashed_password: str

    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"


# ==========================================
# Request Schemas (what API receives)
# ==========================================

class UserRegisterRequest(BaseModel):
    """POST /auth/register"""
    email: EmailStr
    name: str
    company_name: str
    password: str = Field(..., min_length=8)


class UserLoginRequest(BaseModel):
    """POST /auth/login"""
    email: EmailStr
    password: str


# ==========================================
# Response Schemas (what API returns)
# ==========================================

class TokenResponse(BaseModel):
    """Returned after login/register."""
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    """User data returned in API responses (no password)."""
    id: str
    email: str
    name: str
    company_name: str
    is_active: bool
    created_at: datetime