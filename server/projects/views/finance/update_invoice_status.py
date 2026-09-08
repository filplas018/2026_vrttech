from projects.models import Invoice
from projects.serializers import InvoiceSerializer
from projects.views.base_patch_api_view import BasePatchAPIView


class UpdateInvoiceStatusAPIView(BasePatchAPIView):
    model = Invoice
    serializer_class = InvoiceSerializer