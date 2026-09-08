from rest_framework import serializers
from projects.models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'  # Případně vypiš konkrétní pole: ['id', 'first_name', 'last_name', 'company', 'phone', 'email']


class ProjectContactSerializer(ContactSerializer):
    contact_type = serializers.CharField(read_only=True)

    class Meta(ContactSerializer.Meta):
        fields = '__all__'