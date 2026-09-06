
from projects.views.base_list_api_view import BaseListAPIView
from projects.models.site_visit import SiteVisit
from projects.serializers.site_visit_serializer import SiteVisitSerializer


class ListVisitsAPIView(BaseListAPIView):

    queryset = SiteVisit.objects.all()
    serializer_class = SiteVisitSerializer

    filter_fields = [
        'order',
        'assigned_user',
        'planned_at',
        'location',
        'has_project_documentation',
    ]

    select_related = [
        'order',
        'assigned_user',
    ]

    prefetch_related = [
        'conditions',
    ]

    ordering = [
        'planned_at',
    ]

    def get_queryset(self):
        queryset = super().get_queryset()
        order_id = self.kwargs.get('pk')

        return queryset.filter(
            order=order_id,
            
        )