# app/services.py
import secrets
import random
from typing import Tuple, Iterable, List
from django.db import transaction
from django.utils import timezone
from django.db import models
from .models import Exam, Question, ExamQuestion, ExamInvitation
from users.models import User


def _random_ids(qs_ids: List[int], k: int) -> List[int]:
    """Efficient random sampling of IDs without ORDER BY ?."""
    if k >= len(qs_ids):
        return qs_ids
    return random.sample(qs_ids, k)


@transaction.atomic
def assign_random_questions_to_exam(
    *,
    exam: Exam,
    count: int,
    clear_existing: bool = False,
    strict: bool = False,
    weight: float = 1.0
) -> Tuple[int, int]:
    """
    Returns (assigned_count, available_count).

    - strict=False: assign min(count, available)
    - strict=True: raise ValueError if available < count
    """
    if clear_existing:
        ExamQuestion.objects.filter(exam=exam).delete()

    # All questions in the exam's department (supports your current single-FK design)
    # If someday Exam -> many departments, adjust this to filter by multiple.
    q_ids = list(
        Question.objects.filter(departments=exam.department).values_list("id", flat=True)
    )
    available = len(q_ids)

    if strict and available < count:
        raise ValueError(f"Only {available} questions available, requested {count}.")

    pick = min(count, available) if not strict else count
    chosen_ids = _random_ids(q_ids, pick)

    # Determine current max order to append after existing
    start_order = (
        ExamQuestion.objects.filter(exam=exam).aggregate(m=models.Max("order"))["m"] or 0
    )
    bulk = [
        ExamQuestion(
            exam=exam,
            question_id=qid,
            order=start_order + idx + 1,
            weight=weight,
            total_questions=count,  # keep your field meaning
        )
        for idx, qid in enumerate(chosen_ids)
    ]
    ExamQuestion.objects.bulk_create(bulk)
    return len(bulk), available


@transaction.atomic
def invite_department_users_for_exam(
    *,
    exam: Exam,
    added_by: User,
    include_existing: bool = False
) -> Tuple[int, int]:
    """
    Invite all users in exam.department.
    Returns (invited_count, skipped_existing).
    """
    # If your User model relates differently, change the filter here.
    dept_users = User.objects.filter(department=exam.department)

    if not include_existing:
        already = ExamInvitation.objects.filter(exam=exam, user__in=dept_users)\
            .values_list("user_id", flat=True)
        dept_users = dept_users.exclude(id__in=already)

    to_create = [
        ExamInvitation(
            exam=exam,
            user=u,
            added_by=added_by,
            token=secrets.token_urlsafe(24),
            sent_at=timezone.now(),
            is_attempted=False,
        )
        for u in dept_users
    ]

    # Deduplicate defensively against race conditions
    # (unique_together on (exam, user) will protect us; we’ll ignore conflicts)
    created = 0
    skipped = 0
    if to_create:
        try:
            ExamInvitation.objects.bulk_create(to_create, ignore_conflicts=True)
            created = len(to_create)
        except Exception:
            # Fallback (rare): create one-by-one to count precisely
            created = 0
            for inv in to_create:
                try:
                    inv.save()
                    created += 1
                except Exception:
                    skipped += 1

    if not include_existing:
        # Number we’d have skipped because they already existed
        all_in_dept = User.objects.filter(department=exam.department).count()
        existing = ExamInvitation.objects.filter(exam=exam).count()
        # best-effort estimate
        skipped = max(existing - created, 0)

    return created, skipped
