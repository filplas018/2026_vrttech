from projects.views.base_list_api_view import BaseListAPIView
from django.db.models import CharField, OuterRef, Subquery

from projects.models import Contact, ProjectContact
from projects.serializers.contact_serializer import ProjectContactSerializer


class ListProjectContactsAPIView(BaseListAPIView):

    queryset = Contact.objects.all()
    serializer_class = ProjectContactSerializer

    filter_fields = [
        'first_name',
        'last_name',
        'email',
    ]

    ordering = [
        '-last_name',
    ]
    def get_queryset(self):
        queryset = super().get_queryset()

        project_id = self.kwargs.get('pk')
        if project_id:
            contact_type = ProjectContact.objects.filter(
                project_id=project_id,
                contact_id=OuterRef('pk'),
            ).values('contact_type')[:1]

            return queryset.filter(
                projectcontact__project_id=project_id,
            ).annotate(
                contact_type=Subquery(contact_type, output_field=CharField()),
            ).distinct()
        return queryset
