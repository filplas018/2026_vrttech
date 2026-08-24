from rest_framework import serializers
from projects.models import PhotoGallery

class PhotoGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoGallery
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'order', 'name']
        read_only_fields = ['id', 'order']