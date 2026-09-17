from projects.models import Contact
from projects.views.base_patch_api_view import BasePatchAPIView

from projects.serializers.contact_serializer import ContactSerializer


class UpdateContactAPIView(BasePatchAPIView):
    model = Contact
    serializer_class = ContactSerializer
