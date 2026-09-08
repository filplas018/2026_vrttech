from django.http import Http404

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
        report = self.get_queryset().filter(order_id=order_id).order_by('-filled_at', '-id').first()
        if report is None:
            raise Http404
        return report