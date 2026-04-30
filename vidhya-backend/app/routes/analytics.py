"""app/routes/analytics.py  -  Analytics & Dashboard Routes"""
from fastapi import APIRouter, Depends
from app.models.user import User
from app.middleware.auth_middleware import get_current_user, require_admin
import app.controllers.analytics_controller as ctrl

router = APIRouter()

@router.get("/dashboard")
async def dashboard(current_user: User = Depends(get_current_user)):
    return await ctrl.get_dashboard(current_user)

@router.get("/admin")
async def admin_stats(_: User = Depends(require_admin)):
    return await ctrl.get_admin_stats()

@router.get("/study-time")
async def study_time(days: int = 30, current_user: User = Depends(get_current_user)):
    return await ctrl.get_study_time_chart(current_user, days)

@router.get("/subjects")
async def subject_analytics(current_user: User = Depends(get_current_user)):
    return await ctrl.get_subject_analytics(current_user)
