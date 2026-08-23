from projects.views.base_create_api_view import BaseCreateAPIView
from projects.serializers.site_visit_serializer import SiteVisitSerializer

class CreateVisitAPIView(BaseCreateAPIView):
    serializer_class=SiteVisitSerializer