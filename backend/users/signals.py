# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from .tasks import send_pending_approval_email, send_account_verified_email

@receiver(post_save, sender=User)
def handle_user_registration(sender, instance, created, **kwargs):
    if created and not instance.is_verified:
        # New user registered
        send_pending_approval_email.delay(instance.id)

@receiver(post_save, sender=User)
def handle_user_verification(sender, instance, created, **kwargs):
    if not created and instance.is_verified:
        # User just got verified
        send_account_verified_email.delay(instance.id)
