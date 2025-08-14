from django.shortcuts import render
from rest_framework import viewsets,permissions,filters
from .models import *
from .serializers import *
from django.db import transaction
import uuid
from  django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from results_and_attempts.models import UserExamAttempt
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from .serializers import ExamSerializers
from .services import (
    assign_random_questions_to_exam,
    invite_department_users_for_exam,
)
# Create your views here.
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset=Department.objects.all()
    serializer_class=DepartmentSerializers
    # permission_classes=[permissions.IsAuthenticated]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset=Question.objects.all()
    serializer_class=QuestionSerializers
    # permission_classes-[]
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['text']
    ordering_fields=['marks','created_at']

class OptionViewSet(viewsets.ModelViewSet):
    queryset=Option.objects.all()
    serializer_class=OptionSerializers
class ExamViewSet(viewsets.ModelViewSet):
    queryset=Exam.objects.all()
    serializer_class=ExamSerializers
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['title','instructions']
    ordering_fields=['scheduled_start','duration_minutes']
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=["post"], url_path="auto-assign-questions")
    def auto_assign_questions(self, request, pk=None):
        """
        POST /exams/{id}/auto-assign-questions/
        Body:
        {
          "number_of_questions": 20,
          "clear_existing": false,
          "strict": false,
          "weight": 1.0
        }
        """
        exam = self.get_object()
        try:
            num = int(request.data.get("number_of_questions", 0))
        except (TypeError, ValueError):
            return Response({"detail": "number_of_questions must be an integer."},
                            status=status.HTTP_400_BAD_REQUEST)
        if num <= 0:
            return Response({"detail": "number_of_questions must be > 0."},
                            status=status.HTTP_400_BAD_REQUEST)

        clear_existing = bool(request.data.get("clear_existing", False))
        strict = bool(request.data.get("strict", False))
        weight = float(request.data.get("weight", 1.0))

        try:
            with transaction.atomic():
                assigned, available = assign_random_questions_to_exam(
                    exam=exam,
                    count=num,
                    clear_existing=clear_existing,
                    strict=strict,
                    weight=weight,
                )
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "exam_id": exam.id,
            "requested": num,
            "assigned": assigned,
            "available_in_department": available,
            "cleared_existing": clear_existing,
            "strict": strict
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="auto-invite-department-users")
    def auto_invite_department_users(self, request, pk=None):
        """
        POST /exams/{id}/auto-invite-department-users/
        Body:
        {
          "include_existing": false
        }
        """
        exam = self.get_object()
        include_existing = bool(request.data.get("include_existing", False))

        created, skipped = invite_department_users_for_exam(
            exam=exam,
            added_by=request.user,
            include_existing=include_existing
        )
        return Response({
            "exam_id": exam.id,
            "invited_count": created,
            "skipped_existing": skipped,
            "include_existing": include_existing
        }, status=status.HTTP_200_OK)
class ExamQuestionviewSet(viewsets.ModelViewSet):

    queryset=ExamQuestion.objects.all()
    serializer_class=ExamQuestionSerializer

class QuestionWithOptionsViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()   
    serializer_class = QuestionWithOptionsSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['departments','departments__name']

class ExamInvitationViewSet(viewsets.ModelViewSet):
    queryset = ExamInvitation.objects.all()
    serializer_class = ExamInvitationSerializer

    def perform_create(self, serializer):
        # Auto-generate token on creation
        serializer.save(token=str(uuid.uuid4()),added_by=self.request.user)


class ExamStartAPIView(APIView):
    def get(self, request, token):
        #  Validate token & invitation
        try:
            invitation = ExamInvitation.objects.select_related('exam', 'user').get(token=token)
        except ExamInvitation.DoesNotExist:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_404_NOT_FOUND)

        exam = invitation.exam

        #  Check if current time is within the exam window exam timeframe ma aauna paryo request
        now = timezone.now()
        if not (exam.scheduled_start <= now <= exam.scheduled_end):
            return Response({'error': 'Exam is not available'}, status=403)

        # attempt xaina vane baunau
        attempt, created = UserExamAttempt.objects.get_or_create(
            user=invitation.user,
            exam=exam,
            is_submitted=False,  # only ongoing attempts
            defaults={'ip_address': request.META.get('REMOTE_ADDR')}
        )

        # attmpt submit vaisakyo vane paudaina 
        if attempt.is_submitted:
            return Response({'error': 'Exam already submitted.'}, status=403)

        # Fetch questions 
        exam_questions = ExamQuestion.objects.filter(exam=exam).order_by('order')
        questions = [eq.question for eq in exam_questions]

        # Serialize without correct answers
        serializer = QuestionWithSafeOptionsSerializer(questions, many=True)

        # Return the exam data & attempt ID (for later responses)
        return Response({
            "exam_title": exam.title,
            "scheduled_start": exam.scheduled_start,
            "scheduled_end": exam.scheduled_end,
            "attempt_id": attempt.id,
            "questions": serializer.data
        })