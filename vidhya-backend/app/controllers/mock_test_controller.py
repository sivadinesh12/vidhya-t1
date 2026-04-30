"""
app/controllers/mock_test_controller.py  -  Mock Test Logic
"""
from datetime import datetime
from typing import Optional
from fastapi import HTTPException
from app.models.mock_test import (
    MockTest, TestAttempt, Question, StudentAnswer,
    CreateTestSchema, AddQuestionSchema, SubmitTestSchema
)
from app.models.user import User
from app.models.progress import Progress
from app.models.notification import Notification, NotifType
from app.utils.response_helper import success_response


# ── Admin: Create test ────────────────────────────────────────────────────────
async def create_test(body: CreateTestSchema, current_user: User):
    test = MockTest(
        title=body.title,
        description=body.description,
        exam_type=body.exam_type,
        duration_mins=body.duration_mins,
        total_marks=body.total_marks,
        created_by=str(current_user.id),
    )
    await test.insert()
    return success_response("Test created.", test.dict(), status=201)


# ── Admin: Add question ───────────────────────────────────────────────────────
async def add_question(test_id: str, body: AddQuestionSchema, current_user: User):
    test = await MockTest.get(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")
    if test.is_published:
        raise HTTPException(status_code=400, detail="Cannot edit a published test.")

    q = Question(**body.dict())
    test.questions.append(q)
    await test.save()
    return success_response("Question added.", test.dict())


# ── Admin: Publish test ───────────────────────────────────────────────────────
async def publish_test(test_id: str):
    test = await MockTest.get(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")
    if not test.questions:
        raise HTTPException(status_code=400, detail="Cannot publish a test with no questions.")
    test.is_published = True
    await test.save()
    return success_response("Test published.", test.dict())


# ── Student: List available tests ─────────────────────────────────────────────
async def get_tests(exam_type: Optional[str] = None):
    query = {"is_published": True}
    if exam_type:
        query["exam_type"] = exam_type
    tests = await MockTest.find(query).to_list()
    # Don't send correct answers to students
    result = []
    for t in tests:
        d = t.dict()
        for q in d.get("questions", []):
            q.pop("correct_answer", None)
            q.pop("explanation", None)
        result.append(d)
    return success_response("Tests fetched.", result)


# ── Student: Start attempt ────────────────────────────────────────────────────
async def start_attempt(test_id: str, current_user: User):
    test = await MockTest.get(test_id)
    if not test or not test.is_published:
        raise HTTPException(status_code=404, detail="Test not found.")

    # Check if already attempted
    existing = await TestAttempt.find_one({
        "test_id": test_id,
        "student_id": str(current_user.id),
        "is_submitted": False,
    })
    if existing:
        return success_response("Resuming existing attempt.", existing.dict())

    attempt = TestAttempt(
        student_id=str(current_user.id),
        test_id=test_id,
        total_marks=test.total_marks,
    )
    await attempt.insert()
    return success_response("Test started.", attempt.dict(), status=201)


# ── Student: Submit test ──────────────────────────────────────────────────────
async def submit_test(attempt_id: str, body: SubmitTestSchema, current_user: User):
    attempt = await TestAttempt.find_one({
        "_id": attempt_id,
        "student_id": str(current_user.id),
    })
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found.")
    if attempt.is_submitted:
        raise HTTPException(status_code=400, detail="Test already submitted.")

    test = await MockTest.get(attempt.test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")

    # Build question lookup
    q_map = {q.id: q for q in test.questions}

    total_score    = 0.0
    correct_count  = 0
    wrong_count    = 0
    unattempted    = 0
    subject_scores = {}
    student_answers = []

    for ans in body.answers:
        q = q_map.get(ans.question_id)
        if not q:
            continue

        sa = StudentAnswer(
            question_id=ans.question_id,
            selected_answer=ans.selected_answer,
            time_spent_secs=ans.time_spent_secs,
        )

        subj = q.subject.value
        if subj not in subject_scores:
            subject_scores[subj] = 0.0

        if ans.selected_answer is None:
            unattempted += 1
            sa.marks_awarded = 0.0
        elif ans.selected_answer == q.correct_answer:
            sa.is_correct    = True
            sa.marks_awarded = q.marks_correct
            total_score     += q.marks_correct
            subject_scores[subj] += q.marks_correct
            correct_count   += 1
        else:
            sa.is_correct    = False
            sa.marks_awarded = q.marks_wrong
            total_score     += q.marks_wrong
            subject_scores[subj] += q.marks_wrong
            wrong_count     += 1

        student_answers.append(sa)

    attempt.answers        = student_answers
    attempt.score          = round(total_score, 2)
    attempt.percentage     = round((total_score / test.total_marks) * 100, 1) if test.total_marks else 0
    attempt.correct_count  = correct_count
    attempt.wrong_count    = wrong_count
    attempt.unattempted    = unattempted
    attempt.time_taken_mins= body.time_taken_mins
    attempt.subject_scores = subject_scores
    attempt.is_submitted   = True
    attempt.submitted_at   = datetime.utcnow()
    await attempt.save()

    # Update progress stats
    prog = await Progress.find_one({"owner_id": str(current_user.id)})
    if prog:
        prog.mock_tests_attempted += 1
        # Check milestone
        for m in prog.milestones:
            if m.title == "Completed First Mock Test" and not m.achieved:
                m.achieved = True
                m.achieved_at = datetime.utcnow()
        await prog.save()

    # Send notification
    await Notification(
        owner_id=str(current_user.id),
        type=NotifType.milestone,
        title="Mock Test Completed! 🎉",
        message=f"You scored {attempt.score}/{test.total_marks} ({attempt.percentage}%) on {test.title}",
        icon="🧪",
        link="/progress",
    ).insert()

    return success_response("Test submitted successfully.", attempt.dict())


# ── Student: Get my attempts ──────────────────────────────────────────────────
async def get_my_attempts(current_user: User):
    attempts = await TestAttempt.find({
        "student_id": str(current_user.id),
        "is_submitted": True,
    }).sort("-submitted_at").to_list()
    return success_response("Attempts fetched.", [a.dict() for a in attempts])


# ── Get attempt with answer key ───────────────────────────────────────────────
async def get_attempt_detail(attempt_id: str, current_user: User):
    attempt = await TestAttempt.find_one({
        "_id": attempt_id,
        "student_id": str(current_user.id),
    })
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found.")
    if not attempt.is_submitted:
        raise HTTPException(status_code=400, detail="Test not submitted yet.")

    test = await MockTest.get(attempt.test_id)
    return success_response("Attempt detail fetched.", {
        "attempt": attempt.dict(),
        "questions": [q.dict() for q in test.questions] if test else [],
    })
