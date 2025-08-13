from rest_framework import serializers
from .models import UserResponse,  UserExamAttempt
from exams.models import Question, Option,ExamQuestion
from django.db import transaction



# [
#     { "question_id": 12, "selected_option_id": 45 },
#     { "question_id": 13, "selected_option_id": 49 },
#     { "question_id": 14, "text_answer": "Newton's First Law" }
# ]
class UserResponseItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option_id = serializers.IntegerField(required=False, allow_null=True)
    text_answer = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        # Ensure the question exists
        try:
            question = Question.objects.get(id=data['question_id'])
        except Question.DoesNotExist:
            raise serializers.ValidationError(f"Question ID {data['question_id']} not found.")

        # Validate selected option if provided
        if data.get('selected_option_id'):
            try:
                option = Option.objects.get(id=data['selected_option_id'], question=question)
            except Option.DoesNotExist:
                raise serializers.ValidationError(
                    f"Option ID {data['selected_option_id']} not valid for this question."
                )

        return data

# {
#   "attempt_id": 5,
#   "responses": [
#     { "question_id": 12, "selected_option_id": 45 },
#     { "question_id": 13, "selected_option_id": 49 },
#     { "question_id": 14, "text_answer": "Newton's First Law" }
#   ]
# }

class BulkUserResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    responses = UserResponseItemSerializer(many=True)

    def validate_attempt_id(self, value):
        user = self.context['request'].user
        try:
            attempt = UserExamAttempt.objects.get(id=value, user=user)
        except UserExamAttempt.DoesNotExist:
            raise serializers.ValidationError("Invalid attempt ID or not owned by you.")
        self.context['attempt'] = attempt
        return value

    from exams.models import ExamQuestion

    def validate_responses(self, value):
        attempt = self.context.get('attempt')  # set in validate_attempt_id
        question_ids = [r['question_id'] for r in value]
    
        # 1. Check for duplicate questions
        if len(question_ids) != len(set(question_ids)):
            raise serializers.ValidationError("Duplicate questions found.")
    
        # 2. Get valid question IDs for this exam from ExamQuestion
        valid_question_ids = set(
            ExamQuestion.objects.filter(exam=attempt.exam)
            .values_list('question_id', flat=True)
        )
    
        # 3. Check if submitted questions are valid for this exam
        invalid_ids = [qid for qid in question_ids if qid not in valid_question_ids]
        if invalid_ids:
            raise serializers.ValidationError(
                f"Questions {invalid_ids} are not part of this exam."
            )
    
        return value

    @transaction.atomic
    def create(self, validated_data):
        attempt = self.context['attempt']
        responses_data = validated_data['responses']

        question_ids = [r['question_id'] for r in responses_data]
        option_ids = [r['selected_option_id'] for r in responses_data if r.get('selected_option_id')]

        question_map = {q.id: q for q in Question.objects.filter(id__in=question_ids)}
        option_map = {o.id: o for o in Option.objects.filter(id__in=option_ids)}

        for resp in responses_data:
            question = question_map.get(resp['question_id'])
            option = option_map.get(resp.get('selected_option_id'))
            is_correct = option.is_correct if option else False

            UserResponse.objects.update_or_create(
                attempt=attempt,
                question=question,
                defaults={
                    'option': option,
                    'text_answer': resp.get('text_answer', ""),
                    'is_correct': is_correct,
                }
            )

        return None
