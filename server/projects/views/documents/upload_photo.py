from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

from projects.models import PhotoGallery
from projects.serializers.photo_serializer import PhotoSerializer
from projects.utils.efix import extract_gps_coordinates
from projects.views.base_create_api_view import BaseCreateAPIView


class UploadPhotoAPIView(BaseCreateAPIView):
    serializer_class = PhotoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        gallery_id = self.kwargs.get('gallery_id')
        gallery = get_object_or_404(PhotoGallery, pk=gallery_id)

        # Načtení souboru z requestu
        image_file = self.request.FILES.get('image')
        lat, lon = (None, None)

        if image_file:
            lat, lon = extract_gps_coordinates(image_file)

        # Uložení fotky s navázanou galerií a vytaženými GPS souřadnicemi
        return serializer.save(
            gallery=gallery,
            latitude=lat,
            longitude=lon
        )