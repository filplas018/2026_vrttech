from django.shortcuts import get_object_or_404

from projects.models import SiteVisit
from projects.serializers.checklist_serializer import ChecklistSerializer
from projects.views.base_create_api_view import BaseCreateAPIView


class CreateConditionsAPIView(BaseCreateAPIView):
    serializer_class = ChecklistSerializer

    def perform_create(self, serializer):
        site_visit_id = self.kwargs.get('pk')
        site_visit = get_object_or_404(SiteVisit, pk=site_visit_id)
        
        # serializer.save() vytvoří a vrátí instanci Checklist svázanou se SiteVisit
        return serializer.save(site_visit=site_visit)