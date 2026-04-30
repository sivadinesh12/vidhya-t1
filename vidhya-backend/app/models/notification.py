"""
app/models/notification.py  -  Notifications Model
"""
from typing import Optional
from datetime import datetime
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field


class NotifType(str, Enum):
    streak_reminder  = "streak_reminder"
    streak_achieved  = "streak_achieved"
    milestone        = "milestone"
    test_reminder    = "test_reminder"
    study_reminder   = "study_reminder"
    system           = "system"


class Notification(Document):
    owner_id   : str
    type       : NotifType
    title      : str
    message    : str
    is_read    : bool = False
    icon       : str = "🔔"
    link       : Optional[str] = None      # Frontend route to navigate to
    created_at : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"


class CreateNotifSchema(BaseModel):
    owner_id : str
    type     : NotifType
    title    : str
    message  : str
    icon     : str = "🔔"
    link     : Optional[str] = None
