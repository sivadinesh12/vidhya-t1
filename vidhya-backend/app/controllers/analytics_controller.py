"""
app/controllers/analytics_controller.py  -  Dashboard & Analytics
"""
from datetime import datetime, timedelta
from collections import defaultdict
from app.models.user import User
from app.models.progress import Progress
from app.models.mock_test import TestAttempt
from app.models.flashcard import Flashcard
from app.models.study_plan import StudyPlan
from app.models.chat import ChatSession
from app.utils.response_helper import success_response


async def get_dashboard(current_user: User):
    """
    Returns all stats needed for the student dashboard in one call.
    """
    user_id = str(current_user.id)

    # Fetch all data concurrently
    progress    = await Progress.find_one({"owner_id": user_id})
    flashcards  = await Flashcard.find({"owner_id": user_id, "is_archived": False}).count()
    study_plans = await StudyPlan.find({"owner_id": user_id, "is_active": True}).to_list()
    attempts    = await TestAttempt.find({"student_id": user_id, "is_submitted": True}).to_list()
    chats       = await ChatSession.find({"owner_id": user_id, "is_archived": False}).count()

    # Study plan adherence
    total_sessions    = sum(len(p.sessions) for p in study_plans)
    completed_sessions= sum(sum(1 for s in p.sessions if s.is_completed) for p in study_plans)
    adherence         = round((completed_sessions / total_sessions * 100), 1) if total_sessions else 0

    # Test performance
    avg_score = 0.0
    best_score = 0.0
    if attempts:
        avg_score  = round(sum(a.percentage for a in attempts) / len(attempts), 1)
        best_score = round(max(a.percentage for a in attempts), 1)

    # Subject-wise chapter completion
    subject_completion = defaultdict(list)
    if progress:
        for c in progress.chapters:
            subject_completion[c.subject].append(c.completion_pct)

    subject_avg = {
        subj: round(sum(pcts) / len(pcts), 1)
        for subj, pcts in subject_completion.items()
    }

    # Recent activity (last 7 days test scores)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_tests = [
        {
            "date"      : a.submitted_at.strftime("%b %d") if a.submitted_at else "",
            "score"     : a.percentage,
            "test_id"   : a.test_id,
        }
        for a in attempts
        if a.submitted_at and a.submitted_at >= week_ago
    ]

    return success_response("Dashboard data fetched.", {
        "overview": {
            "current_streak"      : progress.current_streak if progress else 0,
            "longest_streak"      : progress.longest_streak if progress else 0,
            "total_study_minutes" : progress.total_study_minutes if progress else 0,
            "total_flashcards"    : flashcards,
            "total_chat_sessions" : chats,
            "mock_tests_attempted": progress.mock_tests_attempted if progress else 0,
            "flashcards_reviewed" : progress.flashcards_reviewed if progress else 0,
        },
        "study_plan": {
            "total_sessions"    : total_sessions,
            "completed_sessions": completed_sessions,
            "adherence_pct"     : adherence,
        },
        "test_performance": {
            "total_attempts": len(attempts),
            "average_score" : avg_score,
            "best_score"    : best_score,
            "recent_tests"  : recent_tests,
        },
        "subject_completion": subject_avg,
        "milestones": [m.dict() for m in progress.milestones] if progress else [],
    })


async def get_admin_stats():
    """Admin-only: platform-wide statistics."""
    from app.models.user import User as UserModel

    total_users    = await UserModel.find().count()
    active_users   = await UserModel.find({"is_active": True}).count()
    total_tests    = await TestAttempt.find({"is_submitted": True}).count()
    total_flashcards = await Flashcard.find().count()

    # Users by exam type
    exam_breakdown = {}
    for exam in ["NEET", "JEE_MAINS", "JEE_ADVANCED", "BOARDS", "OTHER"]:
        count = await UserModel.find({"target_exam": exam}).count()
        exam_breakdown[exam] = count

    # New users last 30 days
    month_ago = datetime.utcnow() - timedelta(days=30)
    new_users_month = await UserModel.find(
        {"created_at": {"$gte": month_ago}}
    ).count()

    return success_response("Admin stats fetched.", {
        "users": {
            "total"         : total_users,
            "active"        : active_users,
            "new_this_month": new_users_month,
            "by_exam"       : exam_breakdown,
        },
        "content": {
            "total_test_attempts": total_tests,
            "total_flashcards"   : total_flashcards,
        },
    })


async def get_study_time_chart(current_user: User, days: int = 30):
    """Returns daily study minutes for the last N days (for chart)."""
    user_id  = str(current_user.id)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    attempts = await TestAttempt.find({
        "student_id": user_id,
        "is_submitted": True,
        "submitted_at": {"$gte": start_date},
    }).to_list()

    # Group by date
    daily_data = defaultdict(lambda: {"study_minutes": 0, "tests": 0})
    for a in attempts:
        if a.submitted_at:
            day = a.submitted_at.strftime("%Y-%m-%d")
            daily_data[day]["study_minutes"] += a.time_taken_mins
            daily_data[day]["tests"] += 1

    # Fill in all days
    chart_data = []
    for i in range(days):
        day = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        chart_data.append({
            "date"          : day,
            "study_minutes" : daily_data[day]["study_minutes"],
            "tests"         : daily_data[day]["tests"],
        })

    return success_response("Study time chart data fetched.", chart_data)


async def get_subject_analytics(current_user: User):
    """Detailed subject-wise breakdown."""
    user_id = str(current_user.id)
    progress = await Progress.find_one({"owner_id": user_id})
    attempts = await TestAttempt.find({
        "student_id": user_id,
        "is_submitted": True,
    }).to_list()

    subjects = ["Biology", "Physics", "Chemistry", "Mathematics"]
    result = {}

    for subj in subjects:
        # Chapter completion
        chapters = []
        if progress:
            chapters = [
                {"name": c.chapter_name, "pct": c.completion_pct}
                for c in progress.chapters if c.subject == subj
            ]

        # Test scores for this subject
        test_scores = []
        for a in attempts:
            if subj in a.subject_scores:
                test_scores.append(a.subject_scores[subj])

        avg_test_score = round(sum(test_scores) / len(test_scores), 1) if test_scores else 0

        # Flashcard count
        fc_count = await Flashcard.find({
            "owner_id": user_id,
            "subject": subj,
            "is_archived": False,
        }).count()

        result[subj] = {
            "chapters"      : chapters,
            "avg_test_score": avg_test_score,
            "flashcard_count": fc_count,
            "overall_pct"   : round(sum(c["pct"] for c in chapters) / len(chapters), 1) if chapters else 0,
        }

    return success_response("Subject analytics fetched.", result)
