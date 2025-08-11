from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'subjects', SubjectViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'options',OptionViewSet)
router.register(r'exams',ExamViewSet)
router.register(r'examquestions',ExamQuestionviewSet)
router.register(r'questionswithoptions', QuestionWithOptionsViewSet, basename='questionswithoptions')

urlpatterns = router.urls
