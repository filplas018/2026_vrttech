from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CreateVisitAPIView(APIView):
    def post(self, request, *args, **kwargs):
        return Response({'message': 'CreateVisitAPIView ještě není naimplementován.'}, status=status.HTTP_501_NOT_IMPLEMENTED)
