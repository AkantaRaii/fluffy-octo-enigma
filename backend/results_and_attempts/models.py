from django.db import models
from users.models import User
from exams.models import Exam,Question,Option
# Create your models here.
class UserExamAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_submitted = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(blank=True, null=True)  # For security
    def calculate_score(self):
        responses = self.responses.filter(
            option__is_correct=True
        ).select_related('question', 'option')
        total = sum(res.question.weight * res.question.marks for res in responses)
        max_possible = sum(eq.weight * eq.question.marks for eq in 
                          self.exam.exam_questions.all())
        return (total / max_possible) * 100 if max_possible else 0


class UserResponse(models.Model):
    attempt = models.ForeignKey(UserExamAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(blank=True)  # For short answers
    responded_at = models.DateTimeField(auto_now_add=True)