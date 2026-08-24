from django.shortcuts import get_object_or_404

from projects.models.order import Order
from projects.serializers.inspection_protocol_serializer import InspectionProtocolSerializer
from projects.views.base_create_api_view import BaseCreateAPIView


class CreateProtocolAPIView(BaseCreateAPIView):
    serializer_class = InspectionProtocolSerializer

    def perform_create(self, serializer):
        order_id = self.kwargs.get('pk')
        order = get_object_or_404(Order, pk=order_id)

        # Naváže zjišťovací protokol na zakázku z URL
        return serializer.save(order=order)