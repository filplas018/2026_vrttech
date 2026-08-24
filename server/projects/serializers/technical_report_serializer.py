from rest_framework import serializers
from projects.models import TechnicalReport

class TechnicalReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalReport
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'order', 'driller', 'filled_at', 'depth_meters', 'technical_specifications', 'alert_driller']
        read_only_fields = ['id', 'order', 'driller', 'filled_at']