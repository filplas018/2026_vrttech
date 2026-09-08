from django.shortcuts import get_object_or_404

from projects.models import Checklist
from projects.serializers.checklist_serializer import ChecklistSerializer
from projects.views.base_get_api_view import BaseGetAPIView


class GetConditionsAPIView(BaseGetAPIView):
    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer

    def get_object(self):
        site_visit_id = self.kwargs.get('pk')
        # Najde checklist podle ID terénní návštěvy z URL (případně vrátí 404)
        return get_object_or_404(self.get_queryset(), site_visit_id=site_visit_id)