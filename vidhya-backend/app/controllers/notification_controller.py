"""
app/controllers/notification_controller.py  -  Notifications
"""
from datetime import datetime
from fastapi import HTTPException
from app.models.notification import Notification, NotifType
from app.models.user import User
from app.utils.response_helper import success_response


async def get_notifications(current_user: User, unread_only: bool = False):
    query = {"owner_id": str(current_user.id)}
    if unread_only:
        query["is_read"] = False
    notifs = await Notification.find(query).sort("-created_at").limit(50).to_list()
    unread_count = await Notification.find(
        {"owner_id": str(current_user.id), "is_read": False}
    ).count()
    return success_response("Notifications fetched.",
        [n.dict() for n in notifs],
        {"unread_count": unread_count}
    )


async def mark_read(notif_id: str, current_user: User):
    notif = await Notification.find_one(
        {"_id": notif_id, "owner_id": str(current_user.id)}
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found.")
    notif.is_read = True
    await notif.save()
    return success_response("Marked as read.", notif.dict())


async def mark_all_read(current_user: User):
    await Notification.find(
        {"owner_id": str(current_user.id), "is_read": False}
    ).update({"$set": {"is_read": True}})
    return success_response("All notifications marked as read.")


async def delete_notification(notif_id: str, current_user: User):
    notif = await Notification.find_one(
        {"_id": notif_id, "owner_id": str(current_user.id)}
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found.")
    await notif.delete()
    return success_response("Notification deleted.", {"id": notif_id})


async def send_study_reminder(current_user: User):
    """Manually trigger a study reminder notification."""
    await Notification(
        owner_id=str(current_user.id),
        type=NotifType.study_reminder,
        title="Time to Study! 📚",
        message="Don't forget to complete today's study sessions.",
        icon="⏰",
        link="/study-planner",
    ).insert()
    return success_response("Study reminder sent.")
