from projects.models import WellWorkflowStep
from projects.serializers.well_workflow_steps_serializer import WellWorkflowStepSerializer
from projects.views.base_list_api_view import BaseListAPIView


class GetWellWorkflowAPIView(BaseListAPIView):
    queryset = WellWorkflowStep.objects.all()
    serializer_class = WellWorkflowStepSerializer

    # Výchozí řazení podle čísla kroku v procesu
    ordering = ['step_number']

    # Optimalizace dotazu na načtení navázaného hydrogeologa
    select_related = [
        'hydrogeologist',
    ]

    def get_queryset(self):
        queryset = super().get_queryset()
        project_id = self.kwargs.get('pk')
        
        # Vrátí pouze kroky workflow pro daný projekt z URL
        return queryset.filter(project_id=project_id)