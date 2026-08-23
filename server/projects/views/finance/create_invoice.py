from projects.views.base_create_api_view import BaseCreateAPIView
from projects.serializers.invoice_serializer import InvoiceSerializer

class CreateInvoiceAPIView(BaseCreateAPIView):
    serializer_class=InvoiceSerializer