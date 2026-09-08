from rest_framework import serializers
from projects.models import PhotoGallery
from projects.serializers.photo_serializer import PhotoSerializer

class PhotoGallerySerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = PhotoGallery
        fields = ['id', 'order', 'name', 'photos']
        read_only_fields = ['id', 'order']