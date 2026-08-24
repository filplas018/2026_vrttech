from django.shortcuts import get_object_or_404

from projects.models.order import Order
from projects.serializers.photo_gallery_serializer import PhotoGallerySerializer
from projects.views.base_create_api_view import BaseCreateAPIView


class CreateGalleryAPIView(BaseCreateAPIView):
    serializer_class = PhotoGallerySerializer

    def perform_create(self, serializer):
        order_id = self.kwargs.get('pk')
        order = get_object_or_404(Order, pk=order_id)

        # Naváže galerii na vytaženou zakázku z URL
        return serializer.save(order=order)