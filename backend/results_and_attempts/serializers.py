# serializers.py
from rest_framework import serializers
from .models import UserExamAttempt, UserResponse
from exams.models import Exam, Option
from django.utils.timezone import now

# ---- Attempt Create ----
class UserExamAttemptCreateSerializer(serializers.ModelSerializer):
    exam_id = serializers.IntegerField(write_only=True)  # input only
    class Meta:
        model = UserExamAttempt
        fields = ["id", "exam_id", "status", "score", "is_submitted"]
        read_only_fields = ["id", "status", "score", "is_submitted"]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user
        exam_id = validated_data.pop("exam_id")
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            raise serializers.ValidationError({"exam_id": "Exam not found."})

        # Note: existing attempt check is handled in ViewSet, so here we just create
        return UserExamAttempt.objects.create(user=user, exam=exam, **validated_data)
class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResponse
        fields = ["id", "attempt", "question", "option", "responded_at", "is_correct"]
        read_only_fields = ["id", "responded_at", "is_correct"]
# ---- Response Bulk Save ----
class UserResponseItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option_ids = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False
    )


class BulkUserResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    responses = UserResponseItemSerializer(many=True)

    def create(self, validated_data):
        attempt_id = validated_data["attempt_id"]
        responses = validated_data["responses"]
        user = self.context['request'].user

        attempt = UserExamAttempt.objects.get(
            id=attempt_id, user=user, is_submitted=False
        )

        user_responses = []
        for r in responses:
            qid = r["question_id"]
            option_ids = r["selected_option_ids"]

            # delete old responses for that question (upsert logic)
            UserResponse.objects.filter(attempt=attempt, question_id=qid).delete()

            for oid in option_ids:
                is_correct = Option.objects.filter(id=oid, is_correct=True).exists()
                resp = UserResponse.objects.create(
                    attempt=attempt,
                    question_id=qid,
                    option_id=oid,
                    is_correct=is_correct,
                )
                user_responses.append(resp)

        return user_responses



# made serailzer for the r      esults
class QuestionResultSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    marks = serializers.FloatField()
    weight = serializers.FloatField()
    user_selected_options = serializers.ListField(child=serializers.CharField())
    correct_options = serializers.ListField(child=serializers.CharField())
    is_correct = serializers.BooleanField()

# serializers.py
from rest_framework import serializers
from .models import UserExamAttempt, UserResponse
from exams.models import Exam, Option
from django.utils.timezone import now

# ---- Attempt Create ----
class UserExamAttemptCreateSerializer(serializers.ModelSerializer):
    exam_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserExamAttempt
        fields = ["id", "exam_id","status","score","is_submitted"]

    def create(self, validated_data):
        user = self.context['request'].user
        exam_id = validated_data['exam_id']
        exam = Exam.objects.get(id=exam_id)

        # Get or create active attempt
        attempt, _ = UserExamAttempt.objects.get_or_create(
            user=user,
            exam=exam,
            is_submitted=False,
        )
        return attempt

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResponse
        fields = ["id", "attempt", "question", "option", "responded_at", "is_correct"]
        read_only_fields = ["id", "responded_at", "is_correct"]
# ---- Response Bulk Save ----
class UserResponseItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option_ids = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False
    )


class BulkUserResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    responses = UserResponseItemSerializer(many=True)

    def create(self, validated_data):
        attempt_id = validated_data["attempt_id"]
        responses = validated_data["responses"]
        user = self.context['request'].user

        attempt = UserExamAttempt.objects.get(
            id=attempt_id, user=user, is_submitted=False
        )

        user_responses = []
        for r in responses:
            qid = r["question_id"]
            option_ids = r["selected_option_ids"]

            # delete old responses for that question (upsert logic)
            UserResponse.objects.filter(attempt=attempt, question_id=qid).delete()

            for oid in option_ids:
                is_correct = Option.objects.filter(id=oid, is_correct=True).exists()
                resp = UserResponse.objects.create(
                    attempt=attempt,
                    question_id=qid,
                    option_id=oid,
                    is_correct=is_correct,
                )
                user_responses.append(resp)

        return user_responses



# made serailzer for the r      esults
class QuestionResultSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    marks = serializers.FloatField()
    weight = serializers.FloatField()
    user_selected_options = serializers.ListField(child=serializers.CharField())
    correct_options = serializers.ListField(child=serializers.CharField())
    is_correct = serializers.BooleanField()

class UserExamResultSerializer(serializers.ModelSerializer):
    total_questions = serializers.SerializerMethodField()
    correct_answers = serializers.SerializerMethodField()
    obtained_marks = serializers.SerializerMethodField()
    total_marks = serializers.SerializerMethodField()
    questions = serializers.SerializerMethodField()

    class Meta:
        model = UserExamAttempt
        fields = [
            "user", "exam", "score", "status", "submitted_at",
            "total_questions", "correct_answers",
            "obtained_marks", "total_marks", "questions"
        ]

    def get_total_questions(self, obj):
        return obj.exam.exam_questions.count()

    def get_correct_answers(self, obj):
        count = 0
        for eq in obj.exam.exam_questions.select_related("question"):
            question = eq.question
            user_responses = obj.responses.filter(question=question)

            user_selected_options = [
                res.option.text for res in user_responses if res.option
            ]
            correct_options = [
                opt.text for opt in question.options.filter(is_correct=True)
            ]
            is_correct = (
                set(user_selected_options) == set(correct_options)
                if question.type in ["MCQ_MULTI", "MCQ_SINGLE"]
                else all(res.is_correct for res in user_responses)
            )

            if is_correct:
                count += 1
        return count

    def get_obtained_marks(self, obj):
        total = 0
        for eq in obj.exam.exam_questions.select_related("question"):
            question = eq.question
            user_responses = obj.responses.filter(question=question)

            user_selected_options = [
                res.option.text for res in user_responses if res.option
            ]
            correct_options = [
                opt.text for opt in question.options.filter(is_correct=True)
            ]
            is_correct = (
                set(user_selected_options) == set(correct_options)
                if question.type in ["MCQ_MULTI", "MCQ_SINGLE"]
                else all(res.is_correct for res in user_responses)
            )

            if is_correct:
                total += question.marks * eq.weight
        return total

    def get_total_marks(self, obj):
        total = 0
        for eq in obj.exam.exam_questions.select_related("question"):
            total += eq.question.marks * eq.weight
        return total

    def get_questions(self, obj):
        result = []
        for eq in obj.exam.exam_questions.select_related("question"):
            question = eq.question
            user_responses = obj.responses.filter(question=question)

            user_selected_options = [
                res.option.text for res in user_responses if res.option
            ]
            correct_options = [
                opt.text for opt in question.options.filter(is_correct=True)
            ]
            is_correct = (
                set(user_selected_options) == set(correct_options)
                if question.type in ["MCQ_MULTI", "MCQ_SINGLE"]
                else all(res.is_correct for res in user_responses)
            )

            result.append({
                "question_id": question.id,
                "question_text": question.text,
                "marks": question.marks,
                "weight": eq.weight,
                "user_selected_options": user_selected_options,
                "correct_options": correct_options,
                "is_correct": is_correct,
            })
        return result
