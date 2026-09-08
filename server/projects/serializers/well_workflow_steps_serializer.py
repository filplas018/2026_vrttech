from rest_framework import serializers
from projects.models import WellWorkflowStep

class WellWorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WellWorkflowStep
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'project', 'step_number', 'status', 'hydrogeologist', 'completed_at']