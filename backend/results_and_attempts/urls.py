# urls.py
from rest_framework.routers import DefaultRouter
from .views import UserExamAttemptViewSet, UserResponseViewSet,ExamResultViewSet

router = DefaultRouter()
router.register(r'attempts', UserExamAttemptViewSet, basename='attempts')
router.register(r'responses', UserResponseViewSet, basename='responses')
router.register(r'results', ExamResultViewSet, basename='results')
urlpatterns = router.urls
