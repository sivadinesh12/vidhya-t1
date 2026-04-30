"""
app/models/mock_test.py  -  Mock Test Model
Full exam simulation with questions, answers, scoring.
"""
from typing import Optional, List
from datetime import datetime
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field


class QuestionType(str, Enum):
    mcq       = "mcq"         # Multiple choice
    numerical = "numerical"   # Integer answer


class TestSubject(str, Enum):
    Biology     = "Biology"
    Physics     = "Physics"
    Chemistry   = "Chemistry"
    Mathematics = "Mathematics"


class Option(BaseModel):
    id    : str   # "A", "B", "C", "D"
    text  : str


class Question(BaseModel):
    id            : str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    subject       : TestSubject
    question_text : str
    image_url     : Optional[str] = None
    q_type        : QuestionType = QuestionType.mcq
    options       : Optional[List[Option]] = None    # For MCQ
    correct_answer: str                              # "A"/"B"/"C"/"D" or number string
    marks_correct : float = 4.0
    marks_wrong   : float = -1.0
    explanation   : Optional[str] = None


class StudentAnswer(BaseModel):
    question_id    : str
    selected_answer: Optional[str] = None           # None = unattempted
    is_correct     : Optional[bool] = None
    marks_awarded  : float = 0.0
    time_spent_secs: int = 0


class MockTest(Document):
    """A test template (created by admin or auto-generated)."""
    title          : str
    description    : Optional[str] = None
    exam_type      : str = "NEET"                   # NEET / JEE_MAINS / JEE_ADVANCED
    duration_mins  : int = 180
    total_marks    : float = 720.0
    questions      : List[Question] = []
    created_by     : str                            # User ID
    is_published   : bool = False
    created_at     : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "mock_tests"


class TestAttempt(Document):
    """A student's attempt at a mock test."""
    student_id     : str
    test_id        : str
    answers        : List[StudentAnswer] = []
    score          : float = 0.0
    total_marks    : float = 0.0
    percentage     : float = 0.0
    correct_count  : int = 0
    wrong_count    : int = 0
    unattempted    : int = 0
    time_taken_mins: int = 0
    subject_scores : dict = {}                      # {"Biology": 180, "Physics": 120, ...}
    is_submitted   : bool = False
    started_at     : datetime = Field(default_factory=datetime.utcnow)
    submitted_at   : Optional[datetime] = None

    class Settings:
        name = "test_attempts"


# ── Schemas ───────────────────────────────────────────────────────────────────
class CreateTestSchema(BaseModel):
    title         : str
    description   : Optional[str] = None
    exam_type     : str = "NEET"
    duration_mins : int = Field(default=180, ge=10, le=360)
    total_marks   : float = 720.0

class AddQuestionSchema(BaseModel):
    subject        : TestSubject
    question_text  : str
    image_url      : Optional[str] = None
    q_type         : QuestionType = QuestionType.mcq
    options        : Optional[List[Option]] = None
    correct_answer : str
    marks_correct  : float = 4.0
    marks_wrong    : float = -1.0
    explanation    : Optional[str] = None

class SubmitAnswerSchema(BaseModel):
    question_id     : str
    selected_answer : Optional[str] = None
    time_spent_secs : int = 0

class SubmitTestSchema(BaseModel):
    answers        : List[SubmitAnswerSchema]
    time_taken_mins: int = 0
