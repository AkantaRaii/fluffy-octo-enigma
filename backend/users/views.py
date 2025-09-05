from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from .serialzers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters,viewsets,status
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
from rest_framework.permissions import AllowAny
from .tasks import send_otp_via_email
from django.utils import timezone
from datetime import  timedelta
import jwt
from exams.models import Department
from .permissions import *
from .throttles import IPBasedThrottle
# Create your views here.

class Me(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        response = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "department": user.department.name if user.department else None}
        return Response(response, status=200)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [IPBasedThrottle]
    throttle_scope = "login"

# users/views.py
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(otp_verified=True)
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['id', 'first_name', 'last_name', 'email', 'role']
    filterset_fields = ['department']
    permission_classes=[IsAdmin]
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['list']:
            return [IsAdminOrAnalyzer()]  
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [ IsAdminOrAnalyzerOrSelf()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        """Restrict non-admin users to limited fields on update"""
        if self.action in ['update', 'partial_update']:
            user = self.request.user
            if not ( user.role == "ADMIN" or user.role == "ANALYZER" ):
                return UserRestrictedSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        user = serializer.save()
        send_otp_via_email.delay(user.email)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "message": "Registration successful, OTP sent to email",
            "data": response.data
        }, status=status.HTTP_201_CREATED)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [IPBasedThrottle]
    throttle_scope = "otp"

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


# Step 2: Verify OTP and issue temporary token
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
            return Response({"error": "User not found"}, status=400)

        if not user.otp or user.otp_expiry < timezone.now():
            return Response({"error": "OTP expired"}, status=400)

        if user.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

  
        temp_token = jwt.encode(
            {
                "email": email,
                "exp": (timezone.now() + timedelta(minutes=5)).timestamp()
            },
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        return Response({"message": "OTP verified", "temp_token": temp_token}, status=200)


# users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import timedelta
import jwt
from django.conf import settings
from .models import User
from .serialzers import *

# Step 1: Request password reset (send OTP)
class ForgotPasswordRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        # Send OTP in background (Celery task)
        from .tasks import send_otp_via_email
        send_otp_via_email.delay(user.email)

        return Response({"message": "OTP sent to email"}, status=200)
# Step 2: Verify OTP and issue temporary token
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
            return Response({"error": "User not found"}, status=400)

        if not user.otp or user.otp_expiry < timezone.now():
            return Response({"error": "OTP expired"}, status=400)

        if user.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        # Issue temporary JWT token (5 minutes)
        temp_token = jwt.encode(
            {
                "email": email,
                "exp": (timezone.now() + timedelta(minutes=5)).timestamp()
            },
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        return Response({"message": "OTP verified", "temp_token": temp_token}, status=200)


# Step 3: Confirm password reset using temp token
class ForgotPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        temp_token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            payload = jwt.decode(temp_token, settings.SECRET_KEY, algorithms=["HS256"])
            email = payload['email']
        except jwt.ExpiredSignatureError:
            return Response({"error": "Temporary token expired"}, status=400)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid temporary token"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        # Reset password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successfully"}, status=200)

class CheckEmailView(APIView):


    def post(self, request, *args, **kwargs):
        email = request.data.get("email", "").strip()
        if not email:
            return Response(
                {"message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        exists = User.objects.filter(email__iexact=email).exists()
        return Response({"exists": exists}, status=status.HTTP_200_OK)