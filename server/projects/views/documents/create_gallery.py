from projects.serializers.photo_gallery_serializer import PhotoGallerySerializer
from projects.views.base_create_api_view import BaseCreateAPIView

class CreateGalleryAPIView(BaseCreateAPIView):
    serializer_class = PhotoGallerySerializer
