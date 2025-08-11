from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serialzers import *

# Create your views here.
class hello(APIView):
    def get(self,request):
        return Response({
            'messsage':'hello'
        })




class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
