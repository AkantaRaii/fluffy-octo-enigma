# serializers.py
from rest_framework import serializers
from .models import UserExamAttempt, UserResponse
from exams.models import Exam, Option
from django.utils.timezone import now
from users.models import User
# # ---- Attempt Create ----
# class UserExamAttemptCreateSerializer(serializers.ModelSerializer):
#     exam_id = serializers.IntegerField(write_only=True)  # input only
#     class Meta:
#         model = UserExamAttempt
#         fields = ["id", "exam_id", "status", "score", "is_submitted"]
#         read_only_fields = ["id", "status", "score", "is_submitted"]

#     def create(self, validated_data):
#         request = self.context.get("request")
#         user = request.user
#         exam_id = validated_data.pop("exam_id")
#         try:
#             exam = Exam.objects.get(id=exam_id)
#         except Exam.DoesNotExist:
#             raise serializers.ValidationError({"exam_id": "Exam not found."})

#         # Note: existing attempt check is handled in ViewSet, so here we just create
#         return UserExamAttempt.objects.create(user=user, exam=exam, **validated_data)
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



# made serailzer for the results
class QuestionResultSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    marks = serializers.FloatField()
    weight = serializers.FloatField()
    user_selected_options = serializers.ListField(child=serializers.CharField())
    correct_options = serializers.ListField(child=serializers.CharField())
    is_correct = serializers.BooleanField()

# serializers.py



class SafeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email",]  # expose only what’s safe

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ["id", "title", "passing_score"]
# ---- Attempt Create ----
class UserExamAttemptCreateSerializer(serializers.ModelSerializer):
    user = SafeUserSerializer(read_only=True)
    exam = ExamSerializer(read_only=True)
    class Meta:
        model = UserExamAttempt
        fields = ["id","user","exam","status","score","is_submitted"]

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
    user=SafeUserSerializer(read_only=True)
    class Meta:
        model = UserExamAttempt
        fields = [
            "user", "exam", "score", "status", "submitted_at",
            "total_questions", "correct_answers",
            "obtained_marks", "total_marks", "questions"
        ]

    # ---- Core question builder ----
    def build_question_data(self, obj):
        result = []
        for eq in obj.exam.exam_questions.select_related("question"):
            question = eq.question
            user_responses = obj.responses.filter(question=question)

            # User-selected option IDs
            user_selected_option_ids = [
                res.option_id for res in user_responses if res.option
            ]

            # All options with extra flags
            options_data = [
                {
                    "id": opt.id,
                    "text": opt.text,
                    "is_correct": opt.is_correct,
                    "is_selected": opt.id in user_selected_option_ids,
                }
                for opt in question.options.all()
            ]

            # Correctness check
            correct_option_ids = list(
                question.options.filter(is_correct=True).values_list("id", flat=True)
            )
            is_correct = (
                set(user_selected_option_ids) == set(correct_option_ids)
                if question.type in ["MCQ_MULTI", "MCQ_SINGLE"]
                else all(res.is_correct for res in user_responses)
            )

            result.append({
                "id": question.id,
                "text": question.text,
                "marks": question.marks,
                "weight": eq.weight,
                "type": question.type,
                "options": options_data,
                "is_correct": is_correct,
            })
        return result

    # ---- Fields using build_question_data ----
    def get_questions(self, obj):
        return self.build_question_data(obj)

    def get_total_questions(self, obj):
        return len(self.build_question_data(obj))

    def get_correct_answers(self, obj):
        return sum(1 for q in self.build_question_data(obj) if q["is_correct"])

    def get_obtained_marks(self, obj):
        total = 0
        for q in self.build_question_data(obj):
            if q["is_correct"]:
                total += q["marks"] * q["weight"]       
        return total

    def get_total_marks(self, obj):
        return sum(q["marks"] * q["weight"] for q in self.build_question_data(obj))
