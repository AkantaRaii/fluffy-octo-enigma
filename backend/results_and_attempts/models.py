from django.db import models
from users.models import User
from exams.models import Exam,Question,Option
# Create your models here.
class UserExamAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)
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

class UserResponse(models.Model):
    attempt = models.ForeignKey(UserExamAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(blank=True)
    responded_at = models.DateTimeField(auto_now_add=True)
    is_correct = models.BooleanField(default=False) 