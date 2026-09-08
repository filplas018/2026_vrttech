from projects.models.order import Order
from projects.serializers.project_serializer import ProjectSerializer
from projects.views.base_get_api_view import BaseGetAPIView


class GetProjectAPIView(BaseGetAPIView):
    queryset = Order.objects.all()
    serializer_class = ProjectSerializer