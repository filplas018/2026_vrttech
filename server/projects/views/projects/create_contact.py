from projects.views.base_create_api_view import BaseCreateAPIView
from projects.serializers.contact_serializer import ContactSerializer

class CreateContactAPIView(BaseCreateAPIView):
    serializer_class = ContactSerializer