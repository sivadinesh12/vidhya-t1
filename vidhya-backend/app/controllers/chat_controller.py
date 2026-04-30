"""
app/controllers/chat_controller.py  -  VIDYA AI Chat History
"""
from datetime import datetime
from fastapi import HTTPException
from app.models.chat import ChatSession, ChatMessage, CreateSessionSchema, SendMessageSchema, MessageRole
from app.models.user import User
from app.utils.response_helper import success_response


async def get_sessions(current_user: User):
    sessions = await ChatSession.find(
        {"owner_id": str(current_user.id), "is_archived": False}
    ).sort("-updated_at").to_list()
    return success_response("Chat sessions fetched.", [_safe(s) for s in sessions])


async def create_session(body: CreateSessionSchema, current_user: User):
    session = ChatSession(
        owner_id=str(current_user.id),
        title=body.title or "New Chat",
        subject=body.subject,
    )
    await session.insert()
    return success_response("Session created.", _safe(session), status=201)


async def get_session(session_id: str, current_user: User):
    session = await ChatSession.find_one(
        {"_id": session_id, "owner_id": str(current_user.id)}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return success_response("Session fetched.", _safe(session))


async def send_message(session_id: str, body: SendMessageSchema, current_user: User):
    """
    Save the user message. The AI response should be sent separately
    from the frontend (using Anthropic/OpenAI SDK) and then saved
    via the save_ai_response endpoint below.
    """
    session = await ChatSession.find_one(
        {"_id": session_id, "owner_id": str(current_user.id)}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    # Add user message
    user_msg = ChatMessage(
        role=MessageRole.user,
        content=body.content,
        image_url=body.image_url,
    )
    session.messages.append(user_msg)

    # Auto-set title from first message
    if len(session.messages) == 1:
        session.title = body.content[:60] + ("..." if len(body.content) > 60 else "")

    session.updated_at = datetime.utcnow()
    await session.save()

    return success_response("Message saved.", _safe(session))


async def save_ai_response(session_id: str, body: SendMessageSchema, current_user: User):
    """Save the AI response after frontend gets it from AI provider."""
    session = await ChatSession.find_one(
        {"_id": session_id, "owner_id": str(current_user.id)}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    ai_msg = ChatMessage(
        role=MessageRole.assistant,
        content=body.content,
    )
    session.messages.append(ai_msg)
    session.updated_at = datetime.utcnow()
    await session.save()

    return success_response("AI response saved.", _safe(session))


async def delete_session(session_id: str, current_user: User):
    session = await ChatSession.find_one(
        {"_id": session_id, "owner_id": str(current_user.id)}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    session.is_archived = True
    await session.save()
    return success_response("Session archived.", {"id": session_id})


async def clear_history(current_user: User):
    """Archive all sessions for the user."""
    await ChatSession.find(
        {"owner_id": str(current_user.id)}
    ).update({"$set": {"is_archived": True}})
    return success_response("All chat history cleared.")


def _safe(session: ChatSession) -> dict:
    d = session.dict()
    d["id"] = str(session.id)
    return d
