from rest_framework import serializers
from projects.models import SiteVisit
from projects.serializers.checklist_serializer import ChecklistSerializer

class SiteVisitSerializer(serializers.ModelSerializer):
    conditions = ChecklistSerializer(read_only=True)

    assigned_user_first_name = serializers.CharField(
        source='assigned_user.first_name',
        read_only=True,
        allow_null=True,
    )
    assigned_user_last_name = serializers.CharField(
        source='assigned_user.last_name',
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = SiteVisit
        fields = [
            'id',
            'order',
            'assigned_user',
            'planned_at',
            'location',
            'has_project_documentation',
            'conditions',
            'assigned_user_first_name',
            'assigned_user_last_name',
        ]