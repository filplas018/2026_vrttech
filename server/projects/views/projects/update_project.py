from projects.models import Order
from projects.serializers import ProjectSerializer
from projects.views.base_patch_api_view import BasePatchAPIView


class UpdateProjectAPIView(BasePatchAPIView):
    model = Order
    serializer_class = ProjectSerializer
