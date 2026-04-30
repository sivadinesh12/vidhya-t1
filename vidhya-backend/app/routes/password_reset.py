"""app/routes/password_reset.py  -  Password Reset Routes"""
from fastapi import APIRouter, Depends
from app.models.password_reset import ForgotPasswordSchema, ResetPasswordSchema, ChangePasswordSchema
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
import app.controllers.password_reset_controller as ctrl

router = APIRouter()

@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordSchema):
    return await ctrl.forgot_password(body)

@router.post("/reset-password")
async def reset_password(body: ResetPasswordSchema):
    return await ctrl.reset_password(body)

@router.post("/change-password")
async def change_password(body: ChangePasswordSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.change_password(body, current_user)
