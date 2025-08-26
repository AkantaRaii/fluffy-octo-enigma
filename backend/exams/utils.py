# exams/utils.py
from datetime import timedelta
from django.utils.crypto import get_random_string
from .models import Exam, ExamQuestion, ExamInvitation
from users.models import User
from django.core.mail import send_mail  # or your own email util
from django.conf import settings


def create_repeated_exam(original_exam: Exam):
    """
    Clone an exam with repeat_after_days and re-invite same users.
    """
    print(f"Creating repeated exam for original exam ID: {original_exam.id}")
    next_start = original_exam.scheduled_start + timedelta(minutes=original_exam.repeat_after_days)
    next_end = original_exam.scheduled_end + timedelta(minutes=original_exam.repeat_after_days)

    # Prevent duplicates if already created
    if Exam.objects.filter(
        parent_exam=original_exam.parent_exam or original_exam,
        scheduled_start=next_start
    ).exists():
        return None
    # Create new exam
    new_exam = Exam.objects.create(
        title=original_exam.title+" (Repeat)",
        department=original_exam.department,
        creator=original_exam.creator,
        duration_minutes=original_exam.duration_minutes,
        scheduled_start=next_start,
        scheduled_end=next_end,
        repeat_after_days=original_exam.repeat_after_days,
        is_active=True,
        instructions=original_exam.instructions,
        parent_exam=original_exam.parent_exam or original_exam,
        passing_score=original_exam.passing_score,
    )

    # Copy exam questions
    for eq in original_exam.exam_questions.all():
        ExamQuestion.objects.create(
            exam=new_exam,
            question=eq.question,
            order=eq.order,
            weight=eq.weight,
        )

    # Copy invitations and send mails
    invitations = ExamInvitation.objects.filter(exam=original_exam)
    for inv in invitations:
        token = get_random_string(32)
        new_inv = ExamInvitation.objects.create(
            exam=new_exam,
            user=inv.user,
            added_by=inv.added_by,
            token=token,
            occurrence=inv.occurrence + 1
        )

        # Example: send email (can also be a Celery task)
        send_mail(
            subject=f"Invitation to Exam: {new_exam.title}",
            message=f"Hello {inv.user.username},\n\n"
                    f"You are invited to retake the exam '{new_exam.title}' "
                    f"scheduled on {new_exam.scheduled_start.strftime('%Y-%m-%d %H:%M')}.\n\n",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[inv.user.email],
            fail_silently=True,
        )

    return new_exam