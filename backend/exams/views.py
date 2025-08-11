from django.shortcuts import render
from rest_framework import viewsets,permissions,filters
from .models import *
from .serializers import *
from django.db import transaction
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
