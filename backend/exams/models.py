from django.db import models
from users.models import User


class Subject(models.Model):
    name = models.CharField(max_length=100)  # e.g., "Behavioral Skills"
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class Question(models.Model):
    QUESTION_TYPES = [
        ('MCQ_SINGLE', 'Single Correct Answer'),
        ('MCQ_MULTI', 'Multiple Correct Answers'),
        ('SHORT_ANSWER', 'Short Answer'),
    ]
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    type = models.CharField(
        max_length=20,
        choices=QUESTION_TYPES,
        default='MCQ_SINGLE'
    )
    text = models.TextField(blank=True)
    marks = models.PositiveIntegerField(default=1)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('subject', 'text',)
    def __str__(self):
        return f"{(self.text[:50])}... ({self.get_type_display()})"


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=200, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Option: {(self.text[:20])} (Correct: {self.is_correct})"
class Exam(models.Model):
    FREQUENCY_CHOICES = [
        ('ONCE', 'One-time'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
    ]
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    duration_minutes = models.PositiveIntegerField()  # Exam duration
    scheduled_start = models.DateTimeField()  # First occurrence
    scheduled_end = models.DateTimeField()  # Last valid date
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default='ONCE')
    is_active = models.BooleanField(default=True)
    instructions = models.TextField(blank=True)
    passing_score = models.PositiveIntegerField(default=60)  # 60% to pass

    def __str__(self):
        return f"{self.title} ({self.scheduled_start.date()})"

class ExamQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='exam_questions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)  # For manual ordering
    weight = models.FloatField(default=1.0)  # Score multiplier

    class Meta:
        ordering = ['order']

class ExamInvitation(models.Model):
    """Tracks who gets which exam (for groups/individuals)."""
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sent_at = models.DateTimeField(auto_now_add=True)
    token = models.CharField(max_length=100, unique=True)  # For secure exam links
    is_attempted = models.BooleanField(default=False)
    class Meta:
        unique_together = ('exam', 'user')
        