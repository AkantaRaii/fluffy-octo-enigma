from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serialzers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics,filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
from rest_framework.permissions import AllowAny
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


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend,filters.SearchFilter,filters.OrderingFilter]
    search_fields = ['first_name','last_name','email']
    ordering_fields = ['id','first_name','last_name','email','role']
    filterset_fields = ["department"]   

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]  # anyone can register
    serializer_class = RegisterUserSerializer