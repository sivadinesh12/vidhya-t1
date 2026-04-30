"""
app/models/password_reset.py  -  Password Reset Token Model
"""
from datetime import datetime, timedelta
from beanie import Document
from pydantic import BaseModel, Field
import secrets


class PasswordResetToken(Document):
    user_id    : str
    token      : str = Field(default_factory=lambda: secrets.token_urlsafe(32))
    expires_at : datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(hours=1)
    )
    is_used    : bool = False
    created_at : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "password_reset_tokens"

    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at


class ForgotPasswordSchema(BaseModel):
    email: str

class ResetPasswordSchema(BaseModel):
    token       : str
    new_password: str = Field(..., min_length=6)

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password    : str = Field(..., min_length=6)
