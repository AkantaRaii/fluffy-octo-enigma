from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', Me.as_view(), name='verify_me'),
    path('users/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('users/forgot-password/request/', ForgotPasswordRequestView.as_view(), name='forgot-password-request'),
    path('users/forgot-password/verify-otp/', VerifyOTPForgotPasswordView.as_view(), name='forgot-password-verify-otp'),
    path('users/forgot-password/confirm/', ForgotPasswordConfirmView.as_view(), name='forgot-password-confirm'),
    path('', include(router.urls)),
]
