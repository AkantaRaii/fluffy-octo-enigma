from django.shortcuts import render
from rest_framework import viewsets,filters
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
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, Sum,Q  # add others if needed
from users.permissions import * 
from .permissions import *
# Create your views here.
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset=Department.objects.all()
    permission_classes=[IsAdminOrAnalyzerOrReadOnly]
    serializer_class=DepartmentSerializers
    # permission_classes=[permissions.IsAuthenticated]
    

class QuestionViewSet(viewsets.ModelViewSet):
    queryset=Question.objects.all()
    serializer_class=QuestionSerializers
    # permission_classes-[]
    permission_classes=[IsAdmin]
    filter_backends=[filters.SearchFilter,filters.OrderingFilter]
    search_fields=['text']
    ordering_fields=['marks','created_at']

class OptionViewSet(viewsets.ModelViewSet):
    queryset=Option.objects.all()
    serializer_class=OptionSerializers
    permission_classes=[IsAdmin]

class ExamViewSet(viewsets.ModelViewSet):
    queryset=Exam.objects.all()
    serializer_class=ExamSerializers
    filter_backends=[filters.SearchFilter,filters.OrderingFilter,DjangoFilterBackend]
    search_fields=['title','instructions']
    ordering_fields=['scheduled_start','duration_minutes']
    permission_classes=[ExamPermission]
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
    @action(detail=False, methods=['get'], url_path='my-invitations')
    def my_invitations(self, request):
        """
        List all exams the current user has been invited to.
        Supports ordering.
        """
        user = request.user
        exams = Exam.objects.filter(examinvitation__user=user).distinct()

        # Apply ordering from query param ?ordering=scheduled_start
        ordering = self.request.query_params.get('ordering')
        if ordering in ['scheduled_start', '-scheduled_start', 'duration_minutes', '-duration_minutes']:
            exams = exams.order_by(ordering)

        serializer = self.get_serializer(exams, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class ExamQuestionviewSet(viewsets.ModelViewSet):
    queryset=ExamQuestion.objects.all()
    serializer_class=ExamQuestionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['exam']
    permission_classes=[IsAdminOrAnalyzerOrReadOnly]
    @action(detail=False, methods=["post"], url_path="bulk_create")
    def bulk_create(self, request):
        """
        Create exam-questions in bulk for all questions of a given department.
        """
        exam_id = request.data.get("exam_id")
        department_id = request.data.get("department_id")
        print(exam_id,department_id)
        if not exam_id or not department_id:
            return Response(
                {"error": "exam_id and department_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # get all questions in the department
        questions = Question.objects.filter(departments__id=department_id)

        exam_questions = []
        for q in questions:
            eq, created = ExamQuestion.objects.get_or_create(
                exam_id=exam_id, question=q
            )
            exam_questions.append(eq)

        serializer = self.get_serializer(exam_questions, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QuestionWithOptionsViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()   
    serializer_class = QuestionWithOptionsSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['departments','departments__name']



class ExamInvitationViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage ExamInvitation objects:
    - list, retrieve, create, update, delete
    - add all users from a department
    - delete all users from an exam
    """
    queryset = ExamInvitation.objects.all()
    serializer_class = ExamInvitationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['exam','user']
    permission_classes=[IsAdminOrAnalyzerOrReadOnly]

    def perform_create(self, serializer):
        # Auto-generate token using UUID and set added_by
        serializer.save(token=str(uuid.uuid4()), added_by=self.request.user)

    @action(detail=False, methods=["post"], url_path="add-department-users")
    def add_department_users(self, request):
        """
        Add all users from a department to an exam.
        Request body:
        {
            "exam": 1,
            "department": 2
        }
        """
        exam_id = request.data.get("exam")
        department_id = request.data.get("department")
        added_by = self.request.user

        if not exam_id or not department_id:
            return Response({"error": "exam and department are required"}, status=400)

        # Get users in department not already added to this exam
        users_to_add = User.objects.filter(
            department_id=department_id
        ).exclude(
            invitated_to__exam_id=exam_id
        )

        invitations = [
            ExamInvitation(
                exam_id=exam_id,
                user=user,
                added_by=added_by,
                token=str(uuid.uuid4())
            )
            for user in users_to_add
        ]

        # Bulk create for efficiency
        ExamInvitation.objects.bulk_create(invitations)

        serializer = self.get_serializer(invitations, many=True)
        return Response(serializer.data, status=201)

    @action(detail=False, methods=["post"], url_path="delete-all-users")
    def delete_all_users(self, request):
        """
        Delete all users from a given exam.
        Request body:
        {
            "exam": 1
        }
        """
        exam_id = request.data.get("exam")
        if not exam_id:
            return Response({"error": "exam is required"}, status=400)

        deleted_count, _ = ExamInvitation.objects.filter(exam_id=exam_id).delete()
        return Response({"deleted": deleted_count}, status=200)



class ExamStartAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, token):
        #  Validate token & invitation
        try:
            invitation = ExamInvitation.objects.select_related('exam', 'user').get(token=token)
        except ExamInvitation.DoesNotExist:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_404_NOT_FOUND)

        exam = invitation.exam

        #  Check if current time is within the exam window exam timeframe ma aauna paryo request
        now = timezone.now()
        print(now)
        print(exam.scheduled_start)
        print(exam.scheduled_end)
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
    


# ---------------- User Dashboard -----------------
class UserDashboardView(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        user = request.user

        # Total assigned exams
        assigned = ExamInvitation.objects.filter(user=user, exam__is_active=True)
        total_exams = assigned.count()

        # Completed / Pending attempts
        attempts = UserExamAttempt.objects.filter(user=user, is_submitted=True)
        completed = attempts.count()
        pending = total_exams - completed

        # Avg score
        avg_score = attempts.aggregate(avg=Avg('score'))['avg'] or 0

        # Pass / fail counts
        passed = attempts.filter(status='passed').count()
        failed = attempts.filter(status='failed').count()

        # Last 5 attempts summary
        last_attempts = attempts.order_by('-submitted_at')[:5].values(
            'exam__title', 'score', 'status', 'submitted_at'
        )

        data = {
            "total_exams": total_exams,
            "completed": completed,
            "pending": pending,
            "avg_score": round(avg_score, 2),
            "passed": passed,
            "failed": failed,
            "last_attempts": list(last_attempts),
        }

        serializer = UserDashboardSerializer(data)
        return Response(serializer.data)



class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        user = request.user
        if user.role != 'ADMIN':
            return Response({"detail": "Unauthorized"}, status=403)

        # Exams and users
        total_exams = Exam.objects.count()
        active_exams = Exam.objects.filter(is_active=True).count()
        total_users = User.objects.count()

        # Pass rate calculation
        submitted_attempts = UserExamAttempt.objects.filter(is_submitted=True)
        stats = submitted_attempts.aggregate(
            total_submitted=Count("id"),
            passed_attempts=Count("id", filter=Q(status="passed")),
        )
        total_submitted = stats["total_submitted"] or 0
        passed_attempts = stats["passed_attempts"] or 0
        pass_rate = (passed_attempts / total_submitted * 100) if total_submitted > 0 else 0

        # Recent attempts (5 latest submitted)
        recent_attempts = list(
            submitted_attempts.order_by("-submitted_at")
            .values("user__email", "exam__title", "score", "status", "submitted_at")[:5]
        )

        # Department stats
        department_stats = list(
            Department.objects.annotate(
                total_exams=Count("exam"),
                active_exams=Count("exam", filter=Q(exam__is_active=True)),
            ).values("name", "total_exams", "active_exams")
        )

        # Prepare response
        data = {
            "total_exams": total_exams,
            "active_exams": active_exams,
            "total_users": total_users,
            "pass_rate": round(pass_rate, 2),  # e.g. 76.45
            "recent_attempts": recent_attempts,
            "department_stats": department_stats,
        }
        return Response(AdminDashboardSerializer(data).data)