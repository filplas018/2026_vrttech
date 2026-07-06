from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated  

from ...models import Order
from projects.serializers.project_serializer import ProjectSerializer

class ListProjectsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        status_param = request.query_params.get('status')
        type_param = request.query_params.get('type')
        
        queryset = Order.objects.all()
        
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        if type_param:
            queryset = queryset.filter(project_type=type_param)
            
        queryset = queryset.order_by('-order_number')
        
        serializer = ProjectSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)