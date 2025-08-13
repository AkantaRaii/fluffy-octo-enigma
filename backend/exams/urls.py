from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import include, path

router = DefaultRouter()
router.register(r'subjects', SubjectViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'options',OptionViewSet)
router.register(r'exams',ExamViewSet)
router.register(r'examquestions',ExamQuestionviewSet)
router.register(r'questionswithoptions', QuestionWithOptionsViewSet, basename='questionswithoptions')
router.register(r"examinvitations", ExamInvitationViewSet, basename="examinvitations")


urlpatterns = [
    path('start/<str:token>/', ExamStartAPIView.as_view(), name='exam-start'),  # custom APIView URL
    path('', include(router.urls)),  # include all router URLs under 'api/'
]