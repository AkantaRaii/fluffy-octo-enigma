# views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from .models import UserExamAttempt, UserResponse

from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets

class UserExamAttemptViewSet(viewsets.ModelViewSet):
    queryset = UserExamAttempt.objects.all()
    serializer_class = UserExamAttemptCreateSerializer

    def get_queryset(self):
        return UserExamAttempt.objects.filter(user=self.request.user)

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




class UserResponseViewSet(viewsets.ModelViewSet):
    queryset = UserResponse.objects.all()
    serializer_class = UserResponseSerializer

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

    def get_queryset(self):
        return UserExamAttempt.objects.filter(user=self.request.user)
    # def get_queryset(self):
    #     return UserExamAttempt.objects.filter)
