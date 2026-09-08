from rest_framework import serializers
from projects.models import ProjectContact

class ProjectContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectContact
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'project', 'contact', 'contact_type']