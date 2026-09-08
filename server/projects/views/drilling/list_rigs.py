from projects.views.base_list_api_view import BaseListAPIView

from projects.models.drilling_rig import DrillingRig
from projects.serializers.drilling_rig_serializer import DrillingRigSerializer


class ListRigsAPIView(BaseListAPIView):

    queryset = DrillingRig.objects.all()
    serializer_class = DrillingRigSerializer

    filter_fields = [
        'name',
        'registration',
    ]

    ordering = [
        'name',
    ]