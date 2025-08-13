from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from serializers import *
class SubmitResponsesView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BulkUserResponseSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Responses saved successfully"}, status=status.HTTP_201_CREATED)