from rest_framework import serializers
from projects.models import DrillingSchedule

class DrillingRigScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillingSchedule
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'project', 'drilling_rig', 'start_date', 'end_date', 'is_contracted']