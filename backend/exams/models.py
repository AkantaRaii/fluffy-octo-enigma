from django.db import models
from users.models import User
from datetime import timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError

class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name


class Question(models.Model):
    QUESTION_TYPES = [
        ('MCQ_SINGLE', 'Single Correct Answer'),
        ('MCQ_MULTI', 'Multiple Correct Answers'),
        ('SHORT_ANSWER', 'Short Answer'),
    ]
    departments = models.ManyToManyField(Department, related_name="questions")
    type = models.CharField(
        max_length=20,
        choices=QUESTION_TYPES,
        default='MCQ_SINGLE'
    )
    text = models.TextField(blank=True)
    marks = models.PositiveIntegerField(default=1)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{(self.text[:50])}... ({self.get_type_display()})"


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=200, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Option: {(self.text[:20])} (Correct: {self.is_correct})"
class Exam(models.Model):
    title = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    duration_minutes = models.PositiveIntegerField()
    scheduled_start = models.DateTimeField()
    scheduled_end = models.DateTimeField()
    repeat_after_days = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Number of days between each exam occurrence. Leave blank for one-time exams."
    )
    is_active = models.BooleanField(default=True)
    instructions = models.TextField(blank=True)
    celery_task_id = models.CharField(max_length=255, blank=True, null=True)
    passing_score = models.PositiveIntegerField(default=60)
    def clean(self):
        now = timezone.now()
        if self.scheduled_start < now:
            self.is_active = False  # auto-deactivate past exams
        if self.scheduled_end <= self.scheduled_start:
            raise ValidationError("Scheduled end must be after scheduled start")

    def save(self, *args, **kwargs):
        self.full_clean()  # calls clean() and field validation
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.title} ({self.scheduled_start.date()})"
    def next_occurrence(self):
        if self.repeat_after_days:
            return self.scheduled_start + timedelta(days=self.repeat_after_days)
        return None


class ExamQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='exam_questions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)  # For manual ordering
    weight = models.FloatField(default=1.0)  # Score multiplier
    total_questions = models.PositiveIntegerField(default=20)
    class Meta:
        ordering = ['order']    

class ExamInvitation(models.Model):
    """Tracks who gets which exam (for groups/individuals)."""
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invitated_to")
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invitated_by")
    sent_at = models.DateTimeField(auto_now_add=True)
    token = models.CharField(max_length=100, unique=True)  # For secure exam links
    is_attempted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('exam', 'user')


