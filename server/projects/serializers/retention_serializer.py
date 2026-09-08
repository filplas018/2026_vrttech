from rest_framework import serializers
from projects.models import Retention

class RetentionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retention
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'order', 'amount', 'retention_type', 'release_date', 'is_released']