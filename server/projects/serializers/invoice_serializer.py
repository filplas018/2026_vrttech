from rest_framework import serializers
from projects.models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'order', 'invoice_number', 'amount', 'issue_date', 'due_date', 'is_paid']