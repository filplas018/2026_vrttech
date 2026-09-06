from projects.views.base_list_api_view import BaseListAPIView
from projects.models import Contact
from projects.serializers.contact_serializer import ContactSerializer


class ListAllContactsAPIView(BaseListAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    filter_fields = [
        'first_name',
        'last_name',
        'email',
    ]

    ordering = [
        '-last_name',
    ]
