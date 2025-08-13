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
# Create your views here.
class SubjectViewSet(viewsets.ModelViewSet):
    queryset=Subject.objects.all()
    serializer_class=SubjectSerializers
    # permission_classes=[permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
class QuestionViewSet(viewsets.ModelViewSet):
    queryset=Question.objects.all()
    serializer_class=QuestionSerializers
    # permission_classes-[]
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['text']
    ordering_fields=['marks','created_at']

    def perform_create(self,serializer):
        serializer.save(created_by=self.request.user)
class OptionViewSet(viewsets.ModelViewSet):
    queryset=Option.objects.all()
    serializer_class=OptionSerializers
class ExamViewSet(viewsets.ModelViewSet):
    queryset=Exam.objects.all()
    serializer_class=ExamSerializers
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['title','instructions']
    ordering_fields=['scheduled_start','duration_minutes']
    def perform_create(self,serializer):
        serializer.save(creator=self.request.user)
class ExamQuestionviewSet(viewsets.ModelViewSet):

    queryset=ExamQuestion.objects.all()
    serializer_class=ExamQuestionSerializer

class QuestionWithOptionsViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionWithOptionsSerializers

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


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