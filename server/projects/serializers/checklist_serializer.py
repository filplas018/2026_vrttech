from rest_framework import serializers
from projects.models import Checklist

class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'site_visit', 'cuttings_disposal', 'has_electricity_25a', 'has_water_connection', 'general_note']
        read_only_fields = ['id', 'site_visit']