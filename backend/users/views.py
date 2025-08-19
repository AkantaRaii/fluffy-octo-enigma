from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serialzers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
# Create your views here.

class Me(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user=User.objects.get(id=user.id)
        response = {
            'email': user.email,
            'role':user.role,
        }
        return Response(response, status=200)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# users/views.py


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["department"]   