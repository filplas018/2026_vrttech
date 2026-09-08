from django.shortcuts import get_object_or_404

from projects.models.order import Order
from projects.serializers.technical_report_serializer import TechnicalReportSerializer
from projects.views.base_create_api_view import BaseCreateAPIView


class CreateTechnicalReportAPIView(BaseCreateAPIView):
    serializer_class = TechnicalReportSerializer

    def perform_create(self, serializer):
        order_id = self.kwargs.get('pk')
        order = get_object_or_404(Order, pk=order_id)

        return serializer.save(order=order)