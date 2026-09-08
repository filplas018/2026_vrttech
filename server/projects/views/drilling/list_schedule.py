
from projects.views.base_list_api_view import BaseListAPIView

from projects.models.drilling_schedule import DrillingSchedule
from projects.serializers.drilling_schedule_serializer import (
    DrillingRigScheduleSerializer
)


class ListScheduleAPIView(BaseListAPIView):

    queryset = DrillingSchedule.objects.all()
    serializer_class = DrillingRigScheduleSerializer

    filter_fields = [
        'project',
        'drilling_rig',
        'start_date',
        'end_date',
        'is_contracted',
    ]

    select_related = [
        'project',
        'drilling_rig',
    ]

    ordering = [
        'start_date',
        'end_date',
    ]