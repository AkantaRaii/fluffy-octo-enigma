# tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import ExamInvitation
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_single_reminder(invitation_id):
    try:
        invitation = ExamInvitation.objects.select_related('user', 'exam').get(id=invitation_id)
        email = invitation.user.email
        if not email:
            logger.warning(f"User {invitation.user.id} has no email.")
            return

        unique_url = f"https://yourdomain.com/exams/start/{invitation.token}/"
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
