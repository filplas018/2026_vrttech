from rest_framework import serializers
from projects.models import DrillingRig

class DrillingRigSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillingRig
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'name', 'registration']