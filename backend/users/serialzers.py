from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['is_verified'] = user.is_verified

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Check if user is verified before issuing token
        if not self.user.is_verified:
            raise serializers.ValidationError("Your account is not verified. Please verify to continue.")

        # Add more user info to the response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'is_verified': self.user.is_verified,
            'role': self.user.role,
        }

        return data
# users/serializers.py
class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "phone",
            "is_verified",
            "department",
            "department_name",
        ]

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()  # short-lived reset token
    new_password = serializers.CharField(write_only=True, min_length=8)
