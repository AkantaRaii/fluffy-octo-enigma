# views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from .models import UserExamAttempt, UserResponse

from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

class UserExamAttemptViewSet(viewsets.ModelViewSet):
    queryset = UserExamAttempt.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return UserExamAttemptCreateSerializer
        return UserExamAttemptCreateSerializer  # or a detail serializer if you want

    def get_queryset(self):
        return UserExamAttempt.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        """Mark attempt as submitted"""
        attempt = self.get_object()
        if attempt.is_submitted:
            return Response({"detail": "Already submitted"}, status=400)

        attempt.is_submitted = True
        attempt.save()
        return Response({"detail": "Exam submitted successfully"})


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
