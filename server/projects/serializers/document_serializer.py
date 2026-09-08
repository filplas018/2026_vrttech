from rest_framework import serializers
from projects.models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'file_name', 'file', 'document_type', 'uploaded_at']
        read_only_fields = ['id', 'order', 'uploaded_at']