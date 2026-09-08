from rest_framework import serializers
from projects.models import InspectionProtocol

class InspectionProtocolSerializer(serializers.ModelSerializer):
    class Meta:
        model = InspectionProtocol
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'order', 'period', 'invoiced_amount', 'is_sent', 'admin_signature_hash']
        read_only_fields = ['id', 'order', 'is_sent', 'admin_signature_hash']