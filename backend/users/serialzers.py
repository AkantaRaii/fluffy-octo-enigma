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



# users/serializers.py
class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "phone",
            "department",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=validated_data.get("role", "USER"),
            phone=validated_data.get("phone", ""),
            department=validated_data.get("department"),
        )
        return user
