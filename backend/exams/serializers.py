from rest_framework import serializers
from .models import *


class DepartmentSerializers(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']
class QuestionSerializers(serializers.ModelSerializer):
    departments = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        many=True
    )
    department_names = serializers.SerializerMethodField()
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)

    class Meta:
        model = Question
        fields = ['id',
            'departments', 'department_names', 'type', 'text',
            'marks', 'created_by', 'created_by_email', 'created_at'
        ]
        read_only_fields = ['created_by']

    def get_department_names(self, obj):
        return [dept.name for dept in obj.departments.all()]

    def create(self, validated_data):
        departments = validated_data.pop('departments', [])
        user = self.context['request'].user
        question = Question.objects.create(created_by=user, **validated_data)
        question.departments.set(departments)
        return question

    def update(self, instance, validated_data):
        departments = validated_data.pop('departments', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if departments is not None:
            instance.departments.set(departments)
        return instance
class OptionSerializers(serializers.ModelSerializer):
    class Meta:
        model=Option
        fields='__all__'
        read_only_fields = ['question']
class ExamSerializers(serializers.ModelSerializer):
    class Meta:
        model=Exam
        fields='__all__'
        read_only_fields=['creator']
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
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    department_names = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'departments', 'department_names', 'type', 'text',
            'marks', 'created_by', 'created_at', 'options', 'created_by_email'
        ]
        read_only_fields = ['created_by']

    def get_department_names(self, obj):
        return [dept.name for dept in obj.departments.all()]
    def create(self, validated_data):
        options_data = validated_data.pop('options')
        departments = validated_data.pop('departments', [])
        user = self.context['request'].user
        question = Question.objects.create(created_by=user, **validated_data)
        question.departments.set(departments)
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
        return question

    
from rest_framework import serializers
from .models import ExamInvitation

class ExamInvitationSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source="exam.title", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ExamInvitation
        fields = [
            "id",
            "exam",
            "exam_title",
            "user",
            "user_email",
            "sent_at",
            "added_by",
            "token",
            "is_attempted",
        ]
        read_only_fields = ["sent_at", "token","added_by"]

        



# yo chai exam ko bela correct options njaos vanera matra 
class OptionSafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text']  # No is_correct

class QuestionWithSafeOptionsSerializer(serializers.ModelSerializer):
    options = OptionSafeSerializer(many=True)
    department_names = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'departments', 'department_names', 'type', 'text', 'marks', 'options']

    def get_department_names(self, obj):
        return [dept.name for dept in obj.departments.all()]