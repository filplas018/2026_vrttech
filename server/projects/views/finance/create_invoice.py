from django.shortcuts import get_object_or_404

from projects.models.order import Order
from projects.serializers.invoice_serializer import InvoiceSerializer
from projects.views.base_create_api_view import BaseCreateAPIView


class CreateInvoiceAPIView(BaseCreateAPIView):
    serializer_class = InvoiceSerializer

    def perform_create(self, serializer):
        order_id = self.kwargs.get('pk')
        order = get_object_or_404(Order, pk=order_id)

        # Naváže fakturu na zakázku z URL
        return serializer.save(order=order)