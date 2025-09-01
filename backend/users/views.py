from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken
from .serialzers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters,viewsets,status
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
from rest_framework.permissions import AllowAny
from .tasks import send_otp_via_email
from django.utils import timezone
from datetime import  timedelta

# Create your views here.

class Me(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user = User.objects.get(id=user.id)
        response = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
        }
        return Response(response, status=200)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# users/views.py


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['id', 'first_name', 'last_name', 'email', 'role']
    filterset_fields = ['department']

    def get_permissions(self):
        if self.action == 'create':  # register
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Called after serializer.is_valid() but before returning response."""
        user = serializer.save()
        # send OTP in background
        send_otp_via_email.delay(user.email)

    def create(self, request, *args, **kwargs):
        """Override create to customize response if needed"""
        response = super().create(request, *args, **kwargs)
        return Response({
            "message": "Registration successful, OTP sent to email",
            "data": response.data
        }, status=status.HTTP_201_CREATED)
    def get_queryset(self):
        return User.objects.filter(otp_verified=True)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.otp or user.otp_expiry < timezone.now():
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp != otp:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user.otp_verified = True
        user.save()

        return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
    
class ForgotPasswordRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        send_otp_via_email.delay(user.email)
        return Response({"message": "OTP sent to email"}, status=status.HTTP_200_OK)


class VerifyOTPForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.otp or user.otp_expiry < timezone.now():
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        if user.otp != otp:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Issue short-lived reset token (5 minutes)
        reset_token = AccessToken.for_user(user)
        reset_token.set_exp(lifetime=timedelta(minutes=5))

        return Response({"reset_token": str(reset_token)}, status=status.HTTP_200_OK)


class ForgotPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            access_token = AccessToken(token)  # validate token
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
        except Exception:
            return Response({"error": "Invalid or expired reset token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
