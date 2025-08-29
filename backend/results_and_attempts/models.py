from django.db import models
from users.models import User
from exams.models import Exam,Question,Option
# Create your models here.
from django.db import models
from django.conf import settings

class UserExamAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    # set only when the attempt is actually submitted
    submitted_at = models.DateTimeField(null=True, blank=True)

    score = models.FloatField(default=0)
    is_submitted = models.BooleanField(default=False)

    status = models.CharField(
        max_length=20,
        choices=[
            ("not_attempted", "Not Attempted"),
            ("failed", "Failed"),
            ("passed", "Passed"),
        ],
        default="not_attempted"
    )

    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        constraints = [
            # DB constraint: only one unfinished attempt per user+exam
            models.UniqueConstraint(
                fields=['user', 'exam'],
                condition=models.Q(is_submitted=False),
                name='unique_unfinished_attempt_per_exam'
            )
        ]

    def __str__(self):
        return f"Attempt by {self.user} on {self.exam} ({'submitted' if self.is_submitted else 'in progress'})"

class UserResponse(models.Model):
    attempt = models.ForeignKey(UserExamAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(blank=True)
    responded_at = models.DateTimeField(auto_now_add=True)
    is_correct = models.BooleanField(default=False)