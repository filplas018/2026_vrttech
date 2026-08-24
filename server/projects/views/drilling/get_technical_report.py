from django.shortcuts import get_object_or_404

from projects.models import TechnicalReport
from projects.serializers.technical_report_serializer import TechnicalReportSerializer
from projects.views.base_get_api_view import BaseGetAPIView


class GetTechnicalReportAPIView(BaseGetAPIView):
    queryset = TechnicalReport.objects.all()
    serializer_class = TechnicalReportSerializer

    # Optimalizace načtení údajů o vrtmistrovi (User model)
    select_related = [
        'driller',
    ]

    def get_object(self):
        order_id = self.kwargs.get('pk')
        # Vyhledá technickou zprávu svázanou se zakázkou z URL (případně vrátí 404)
        return get_object_or_404(self.get_queryset(), order_id=order_id)