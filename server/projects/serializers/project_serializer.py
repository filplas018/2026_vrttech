from rest_framework import serializers
from projects.models import Order

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'title', 'status', 'project_type']