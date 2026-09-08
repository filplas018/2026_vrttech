from projects.views.base_create_api_view import BaseCreateAPIView
from projects.serializers.drilling_schedule_serializer import DrillingRigScheduleSerializer

class CreateScheduleAPIView(BaseCreateAPIView):
    serializer_class=DrillingRigScheduleSerializer
    
