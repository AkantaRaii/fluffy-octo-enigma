from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        # Remove username if you want, or keep it if you added it elsewhere

        return token
    def validate(self, attrs):
        data = super().validate(attrs)

        # Optional: Add more user info to the response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'is_verified': self.user.is_verified,
            'role':self.user.role
        }

        return data

# users/serializers.py
class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "role", "phone", "is_verified", "department", "department_name"]