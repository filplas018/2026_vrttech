from projects.views.base_create_api_view import BaseCreateAPIView
from projects.serializers.project_serializer import ProjectSerializer

class CreateProjectAPIView(BaseCreateAPIView):
    serializer_class = ProjectSerializer