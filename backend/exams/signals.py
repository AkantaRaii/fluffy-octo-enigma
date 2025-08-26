from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from celery import current_app
from .models import Exam
from .tasks import send_exam_reminder,create_next_exam_task
import logging
from .tasks import create_next_exam_task

logger = logging.getLogger(__name__)
CREATION_BUFFER_DAYS = 2
@receiver(post_save, sender=Exam)
def schedule_exam_reminder(sender, instance, created, **kwargs):
    try:
        if instance.scheduled_start <= timezone.now():
            return  # Skip past exams

        # Cancel old task if it exists (update case)
        if instance.celery_task_id:
            try:
                current_app.control.revoke(instance.celery_task_id, terminate=True)
                logger.info(f"Revoked previous task {instance.celery_task_id} for exam {instance.id}")
            except Exception as e:
                logger.error(f"Failed to revoke task {instance.celery_task_id} for exam {instance.id}: {e}")

        # Schedule reminder 20 seconds before the exam
        reminder_time = instance.scheduled_start - timedelta(seconds=20)
        if reminder_time <= timezone.now():
            return  # Skip if reminder time already passed

        # Schedule new task
        task = send_exam_reminder.apply_async(args=[instance.id], eta=reminder_time)
        logger.info(f"Scheduled reminder task {task.id} for exam {instance.id} at {reminder_time}")

        # Update celery_task_id directly in the database if changed
        if instance.celery_task_id != task.id:
            Exam.objects.filter(id=instance.id).update(celery_task_id=task.id)

    except Exception as e:
        logger.error(f"Error scheduling reminder for exam {instance.id}: {e}")

@receiver(post_delete, sender=Exam)
def remove_schedule(sender, instance, **kwargs):
    try:
        if instance.celery_task_id:
            current_app.control.revoke(instance.celery_task_id, terminate=True)
            logger.info(f"Revoked task {instance.celery_task_id} after deleting exam {instance.id}")
    except Exception as e:
        logger.error(f"Failed to revoke task {instance.celery_task_id} after deleting exam {instance.id}: {e}")


@receiver(post_save, sender=Exam)
def schedule_next_exam(sender, instance, created, **kwargs):
    from .tasks import create_next_exam_task
    print("Signal triggered for scheduling next exam.")

    # Revoke old task if repeat is removed
    if not created and instance.celery_task_id and not instance.repeat_after_days:
        current_app.control.revoke(instance.celery_task_id, terminate=True)
        instance.celery_task_id = None
        instance.save(update_fields=['celery_task_id'])

    # Schedule new task on creation
    if created and instance.repeat_after_days:
        next_start = instance.scheduled_start + timedelta(days=instance.repeat_after_days)
        creation_time = next_start - timedelta(days=CREATION_BUFFER_DAYS)

        task = create_next_exam_task.apply_async(
            args=[instance.id],
            eta=creation_time
        )
        instance.celery_task_id = task.id
        instance.save(update_fields=['celery_task_id'])
