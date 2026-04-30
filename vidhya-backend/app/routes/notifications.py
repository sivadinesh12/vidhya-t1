"""app/routes/notifications.py  -  Notification Routes"""
from fastapi import APIRouter, Depends
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
import app.controllers.notification_controller as ctrl

router = APIRouter()

@router.get("/")
async def get_notifications(unread_only: bool = False, current_user: User = Depends(get_current_user)):
    return await ctrl.get_notifications(current_user, unread_only)

@router.patch("/{notif_id}/read")
async def mark_read(notif_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.mark_read(notif_id, current_user)

@router.patch("/read-all")
async def mark_all_read(current_user: User = Depends(get_current_user)):
    return await ctrl.mark_all_read(current_user)

@router.delete("/{notif_id}")
async def delete_notification(notif_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.delete_notification(notif_id, current_user)

@router.post("/study-reminder")
async def send_reminder(current_user: User = Depends(get_current_user)):
    return await ctrl.send_study_reminder(current_user)
