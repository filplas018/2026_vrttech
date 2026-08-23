from rest_framework import serializers
from projects.models import SiteVisit

class SiteVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteVisit
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'order', 'assigned_user', 'planned_at', 'location', 'has_project_documentation']