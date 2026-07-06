from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class UpdateProjectAPIView(APIView):
    def patch(self, request, *args, **kwargs):
        return Response({'message': 'UpdateProjectAPIView ještě není naimplementován.'}, status=status.HTTP_501_NOT_IMPLEMENTED)
