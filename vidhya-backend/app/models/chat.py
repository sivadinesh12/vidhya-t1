"""
app/models/chat.py  -  VIDYA AI Chat History Model
Stores conversation history between student and VIDYA AI.
"""
from typing import Optional, List
from datetime import datetime
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field


class MessageRole(str, Enum):
    user      = "user"
    assistant = "assistant"


class ChatMessage(BaseModel):
    role      : MessageRole
    content   : str
    timestamp : datetime = Field(default_factory=datetime.utcnow)
    image_url : Optional[str] = None   # for photo-of-question uploads


class ChatSession(Document):
    owner_id    : str
    title       : str = "New Chat"          # Auto-set from first message
    subject     : Optional[str] = None
    messages    : List[ChatMessage] = []
    is_archived : bool = False
    created_at  : datetime = Field(default_factory=datetime.utcnow)
    updated_at  : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_sessions"


class SendMessageSchema(BaseModel):
    content   : str = Field(..., max_length=5000)
    image_url : Optional[str] = None

class CreateSessionSchema(BaseModel):
    title   : Optional[str] = "New Chat"
    subject : Optional[str] = None
