"""app/routes/chat.py  -  VIDYA AI Chat Routes"""
from fastapi import APIRouter, Depends
from app.models.chat import CreateSessionSchema, SendMessageSchema
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
import app.controllers.chat_controller as ctrl

router = APIRouter()

@router.get("/")
async def get_sessions(current_user: User = Depends(get_current_user)):
    return await ctrl.get_sessions(current_user)

@router.post("/")
async def create_session(body: CreateSessionSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.create_session(body, current_user)

@router.get("/{session_id}")
async def get_session(session_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.get_session(session_id, current_user)

@router.post("/{session_id}/messages")
async def send_message(session_id: str, body: SendMessageSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.send_message(session_id, body, current_user)

@router.post("/{session_id}/ai-response")
async def save_ai_response(session_id: str, body: SendMessageSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.save_ai_response(session_id, body, current_user)

@router.delete("/{session_id}")
async def delete_session(session_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.delete_session(session_id, current_user)

@router.delete("/")
async def clear_history(current_user: User = Depends(get_current_user)):
    return await ctrl.clear_history(current_user)
