# views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from django.utils import timezone
from .models import UserExamAttempt, UserResponse
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from .permissions import *
from users.permissions import *

class UserExamAttemptViewSet(viewsets.ModelViewSet):
    queryset = UserExamAttempt.objects.all()
    serializer_class = UserExamAttemptCreateSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['exam','user']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["ADMIN", "ANALYZER"]:
            queryset = UserExamAttempt.objects.all()
        else:
            queryset = UserExamAttempt.objects.filter(user=user)

        # Optional exam filter
        exam_id = self.request.query_params.get("exam")
        if exam_id:
            queryset = queryset.filter(exam_id=exam_id)

        return queryset
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def create(self, request, *args, **kwargs):
        exam_id = request.data.get("exam_id")
        user = request.user
        if not exam_id:
            return Response({"exam_id": "This field is required"}, status=400)

        from exams.models import Exam
        exam = Exam.objects.get(id=exam_id)

        # Check if attempt exists
        existing_attempt = UserExamAttempt.objects.filter(user=user, exam=exam).first()
        if existing_attempt:
            if existing_attempt.is_submitted:
                return Response(
                    {"detail": "You have already submitted this exam."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    UserExamAttemptCreateSerializer(existing_attempt).data,
                    status=status.HTTP_200_OK
                )

        # No attempt exists, create new
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # --- New action: submit exam ---
    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        attempt = self.get_object()
        if attempt.is_submitted:
            return Response({"detail": "Already submitted."}, status=status.HTTP_400_BAD_REQUEST)

        exam = attempt.exam
        total_marks = 0
        obtained_marks = 0

        for eq in exam.exam_questions.select_related("question"):
            question = eq.question
            total_marks += question.marks * eq.weight

            user_responses = attempt.responses.filter(question=question)
            user_selected = [res.option for res in user_responses if res.option]
            correct_options = list(question.options.filter(is_correct=True))

            is_correct = (
                set(user_selected) == set(correct_options)
                if question.type in ["MCQ_MULTI", "MCQ_SINGLE"]
                else all(res.is_correct for res in user_responses)
            )

            if is_correct:
                obtained_marks += question.marks * eq.weight

        pass_threshold = (exam.passing_score / 100) * total_marks
        attempt.score = obtained_marks
        attempt.is_submitted = True
        attempt.submitted_at = timezone.now()
        attempt.status = "passed" if obtained_marks >= pass_threshold else "failed"
        attempt.save()

        return Response(
            {
                "score": attempt.score,
                "status": attempt.status,
                "submitted_at": attempt.submitted_at,
                "total_marks": total_marks,
                "pass_threshold": exam.passing_score ,
            },
            status=status.HTTP_200_OK
        )

class UserResponseViewSet(viewsets.ModelViewSet):
    queryset = UserResponse.objects.all()
    serializer_class = UserResponseSerializer
    permission_classes = [IsAuthenticated, CanEditOwnResponseUntilSubmitted]
    def get_queryset(self):
        return UserResponse.objects.filter(attempt__user=self.request.user)

    @action(detail=False, methods=["post"])
    def bulk_save(self, request):
        serializer = BulkUserResponseSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        responses = serializer.save()
        return Response(UserResponseSerializer(responses, many=True).data, status=200)

class ExamResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserExamResultSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['exam','user']
    permission_classes=[IsAdminOrAnalyzerOrReadOnly]
    def get_queryset(self):
        user = self.request.user
        if user.role in ["ADMIN", "ANALYZER"]:
            return UserExamAttempt.objects.all()
        return UserExamAttempt.objects.filter(user=user)