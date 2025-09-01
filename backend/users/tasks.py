# users/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from .models import User
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random ,re
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

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




@shared_task
def send_otp_via_email(email: str, expiry_minutes: int = 5) -> bool:
    """
    Sends a one-time password (OTP) to the given email.
    Updates user's otp and otp_expiry fields.
    Returns True on success, False on failure.
    """

    otp = random.randint(100000, 999999)
    subject = "Your One-Time Password (OTP)"
    message = f"""
Hello,

Your One-Time Password (OTP) is: {otp}

This OTP is valid for the next {expiry_minutes} minutes. Please do not share this code with anyone.

If you did not request this, please ignore this email.

Regards,
Your Company Team
    """

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False
        )
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

    try:
        user = User.objects.get(email=email)
        user.otp = otp
        user.otp_expiry = timezone.now() + timedelta(minutes=expiry_minutes)
        user.save()
        print("OTP saved to user"+email)
        return True
    except User.DoesNotExist:
        print("User with this email does not exist.")
        return False
