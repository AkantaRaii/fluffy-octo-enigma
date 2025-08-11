from rest_framework import serializers
from .models import *


class SubjectSerializers(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'description', 'created_by', 'created_by_email']
class QuestionSerializers(serializers.ModelSerializer):
    subject_name=serializers.CharField(source='subject.name',read_only=True)
    created_by_email=serializers.EmailField(source='created_by.email',read_only=True)
    class Meta:
        model=Question
        fields=['subject','subject_name','type','text','marks','created_by','created_by_email','created_at']
        read_only_fields=['created_by']
class OptionSerializers(serializers.ModelSerializer):
    class Meta:
        model=Option
        fields='__all__'
        read_only_fields = ['question']
class ExamSerializers(serializers.Serializer):
    class Meta:
        model=Exam
        fields='__all__'
        read_only_fields=['creator','']
class ExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=ExamQuestion
        fields='__all__'


class OptionNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'
        read_only_fields = ['question']
class QuestionWithOptionsSerializers(serializers.ModelSerializer):
    options = OptionNestedSerializer(many=True)
    created_by_email=serializers.EmailField(source='created_by.email',read_only=True)
    subject_name=serializers.CharField(source='subject.name',read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'subject', 'type', 'text', 'marks', 'created_by','created_at', 'options','created_by_email','subject_name']
        read_only_fields = ['created_by']
    def create(self, validated_data):
        options_data = validated_data.pop('options')
        user = self.context['request'].user
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
        return question