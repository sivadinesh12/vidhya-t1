"""app/routes/mock_tests.py  -  Mock Test Routes"""
from typing import Optional
from fastapi import APIRouter, Depends
from app.models.mock_test import CreateTestSchema, AddQuestionSchema, SubmitTestSchema
from app.models.user import User
from app.middleware.auth_middleware import get_current_user, require_admin
import app.controllers.mock_test_controller as ctrl

router = APIRouter()

@router.get("/")
async def get_tests(exam_type: Optional[str] = None, _: User = Depends(get_current_user)):
    return await ctrl.get_tests(exam_type)

@router.post("/")
async def create_test(body: CreateTestSchema, current_user: User = Depends(require_admin)):
    return await ctrl.create_test(body, current_user)

@router.post("/{test_id}/questions")
async def add_question(test_id: str, body: AddQuestionSchema, current_user: User = Depends(require_admin)):
    return await ctrl.add_question(test_id, body, current_user)

@router.patch("/{test_id}/publish")
async def publish_test(test_id: str, _: User = Depends(require_admin)):
    return await ctrl.publish_test(test_id)

@router.post("/{test_id}/attempt")
async def start_attempt(test_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.start_attempt(test_id, current_user)

@router.post("/attempts/{attempt_id}/submit")
async def submit_test(attempt_id: str, body: SubmitTestSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.submit_test(attempt_id, body, current_user)

@router.get("/attempts/my")
async def my_attempts(current_user: User = Depends(get_current_user)):
    return await ctrl.get_my_attempts(current_user)

@router.get("/attempts/{attempt_id}")
async def attempt_detail(attempt_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.get_attempt_detail(attempt_id, current_user)
