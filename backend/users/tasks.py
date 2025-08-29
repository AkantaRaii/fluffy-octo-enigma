# users/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import User

@shared_task
def send_pending_approval_email(user_id):
    user = User.objects.get(id=user_id)
    send_mail(
        subject="Account Registered - Pending Approval",
        message="Thank you for registering. Your account is pending admin approval.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )

@shared_task
def send_account_verified_email(user_id):
    user = User.objects.get(id=user_id)
    send_mail(
        subject="Account Approved",
        message="Your account has been approved! You can now log in.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
