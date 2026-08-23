
from projects.views.base_list_api_view import BaseListAPIView
from projects.models.site_visit import SiteVisit
from projects.serializers.site_visit_serializer import SiteVisitSerializer


class ListMyVisitsAPIView(BaseListAPIView):

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

    ordering = [
        'planned_at',
    ]

    def get_queryset(self):
        queryset = super().get_queryset()

        return queryset.filter(
            assigned_user=self.request.user
        )