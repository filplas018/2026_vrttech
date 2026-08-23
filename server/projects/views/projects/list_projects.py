from projects.views.base_list_api_view import BaseListAPIView
from projects.models.order import Order
from projects.serializers.project_serializer import ProjectSerializer

class ListProjectsAPIView(BaseListAPIView):

    queryset = Order.objects.all()
    serializer_class = ProjectSerializer

    filter_fields = [
        'order_number',
        'name',
        'order_type',
        'order_state',
        'customer_interest',
        'total_budget',
        'warranty_from',
        'warranty_to',
    ]

    ordering = [
        '-order_number',
    ]