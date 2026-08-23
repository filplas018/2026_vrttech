from rest_framework import serializers
from projects.models import Photo

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'gallery', 'image', 'latitude', 'longitude', 'uploaded_at']