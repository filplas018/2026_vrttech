from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

from projects.models.order import Order
from projects.serializers.document_serializer import DocumentSerializer
from projects.views.base_create_api_view import BaseCreateAPIView


class UploadDocumentAPIView(BaseCreateAPIView):
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        order_id = self.kwargs.get('pk')
        order = get_object_or_404(Order, pk=order_id)

        # Uloží dokument a naváže ho na zakázku podle pk v URL
        return serializer.save(order=order)