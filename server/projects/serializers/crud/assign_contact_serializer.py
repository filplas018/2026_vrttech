from rest_framework import serializers
from projects.enums.project_enums import ContactType

class AssignContactSerializer(serializers.Serializer):
    contact_id = serializers.IntegerField()
    contact_type = serializers.ChoiceField(choices=ContactType.choices)