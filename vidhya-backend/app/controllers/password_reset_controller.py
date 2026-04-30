"""
app/controllers/password_reset_controller.py  -  Password Reset & Change
Note: In production, connect an email service (SendGrid/SES) to send the reset link.
For now, the token is returned in the response (dev mode) or logged.
"""
from datetime import datetime
from fastapi import HTTPException
from loguru import logger

from app.models.user import User
from app.models.password_reset import PasswordResetToken, ForgotPasswordSchema, ResetPasswordSchema, ChangePasswordSchema
from app.utils.response_helper import success_response
from app.config.settings import settings


async def forgot_password(body: ForgotPasswordSchema):
    user = await User.find_one(User.email == body.email.lower())

    # Always return success (don't reveal if email exists - security best practice)
    if not user:
        return success_response(
            "If this email exists, a reset link has been sent.",
            {"note": "Check your email for the reset link."}
        )

    # Invalidate old tokens
    old_tokens = await PasswordResetToken.find(
        {"user_id": str(user.id), "is_used": False}
    ).to_list()
    for t in old_tokens:
        t.is_used = True
        await t.save()

    # Create new token
    reset_token = PasswordResetToken(user_id=str(user.id))
    await reset_token.insert()

    # In production: send email with reset link
    # reset_link = f"{settings.CLIENT_URL}/reset-password?token={reset_token.token}"
    # await send_email(user.email, "Reset your Vidhya password", reset_link)

    logger.info(f"Password reset token for {user.email}: {reset_token.token}")

    response_data = {"message": "Reset link sent to your email."}

    # In development, return token directly for testing
    if settings.ENVIRONMENT == "development":
        response_data["dev_token"] = reset_token.token
        response_data["note"] = "Token exposed in dev mode only. Remove in production."

    return success_response("If this email exists, a reset link has been sent.", response_data)


async def reset_password(body: ResetPasswordSchema):
    token_doc = await PasswordResetToken.find_one(
        {"token": body.token, "is_used": False}
    )

    if not token_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    if token_doc.is_expired():
        raise HTTPException(status_code=400, detail="Reset token has expired. Please request a new one.")

    user = await User.get(token_doc.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Set new password
    user.set_password(body.new_password)
    user.updated_at = datetime.utcnow()
    await user.save()

    # Mark token as used
    token_doc.is_used = True
    await token_doc.save()

    logger.info(f"Password reset successful for user: {user.email}")
    return success_response("Password reset successfully. Please log in with your new password.")


async def change_password(body: ChangePasswordSchema, current_user: User):
    """Change password for logged-in user (requires current password)."""
    if not current_user.verify_password(body.current_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")

    if body.current_password == body.new_password:
        raise HTTPException(status_code=400, detail="New password must be different from current password.")

    current_user.set_password(body.new_password)
    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    logger.info(f"Password changed for user: {current_user.email}")
    return success_response("Password changed successfully.")
