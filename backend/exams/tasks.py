# tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import ExamInvitation
import logging
from .models import Exam
from .utils import create_repeated_exam
from django.utils import timezone
from datetime import timedelta
from results_and_attempts.models import UserExamAttempt 

logger = logging.getLogger(__name__)

@shared_task
def send_single_reminder(invitation_id):
    try:
        invitation = ExamInvitation.objects.select_related('user', 'exam').get(id=invitation_id)
        email = invitation.user.email
        if not email:
            logger.warning(f"User {invitation.user.id} has no email.")
            return

        unique_url = f"http://localhost:3000/application/user/upcoming/{invitation.exam_id}/{invitation.token}/"
        subject = f"Reminder: {invitation.exam.title}"
        message = (
            f"Hi {invitation.user.get_full_name() or invitation.user.username},\n\n"
            f"Your exam '{invitation.exam.title}' is scheduled at {invitation.exam.scheduled_start}.\n"
            f"Access your exam here: {unique_url}\n\nGood luck!"
        )

        sent_count = send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
        if sent_count == 0:
            logger.warning(f"Failed to send email to {email}")
        else:
            logger.info(f"Sent reminder to {email}")

    except ExamInvitation.DoesNotExist:
        logger.error(f"Invitation {invitation_id} does not exist.")
    except Exception as e:
        logger.error(f"Error sending reminder to invitation {invitation_id}: {e}")

@shared_task
def send_exam_reminder(exam_id):
    invitations = ExamInvitation.objects.filter(exam_id=exam_id)
    for invitation in invitations:
        send_single_reminder.delay(invitation.id)




@shared_task
def create_next_exam_task(exam_id):
    print(f"Creating next exam for exam ID: {exam_id}")
    try:
        exam = Exam.objects.get(id=exam_id)
        create_repeated_exam(exam)  # creates new exam, invitations, and sends mails
    except Exam.DoesNotExist:
        pass

@shared_task
def create_repeated_exams():
    now = timezone.now()
    yesterday = now - timedelta(minutes=1)

    ended_exams = Exam.objects.filter(
        scheduled_end__gte=yesterday,
        scheduled_end__lte=now,
        parent_exam__isnull=True,
    )
    for exam in ended_exams:
        next_start = exam.scheduled_start + timedelta(minutes=3)
        next_end = exam.scheduled_end + timedelta(minutes=3)

        failed = UserExamAttempt.objects.filter(exam=exam, status="failed")

        exists = Exam.objects.filter(
            parent_exam=exam,
            scheduled_start=next_start
        ).exists()

        if not exists:
            new_exam = Exam.objects.create(
                title=exam.title+(" - Retake"),
                department=exam.department,
                creator=exam.creator,
                duration_minutes=exam.duration_minutes,
                scheduled_start=next_start,
                scheduled_end=next_end,
                repeat_after_days=exam.repeat_after_days,
                parent_exam=exam,
                instructions=exam.instructions,
                passing_score=exam.passing_score
            )

             # Enroll failed students into new exam
            for attempt in failed:
                ExamInvitation.objects.create(
                        user=attempt.user,
                        exam=new_exam,
                        added_by=exam.creator,   # original creator of the exam
                        )