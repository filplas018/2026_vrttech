from projects.views.base_list_api_view import BaseListAPIView
from users.models import User
from users.serializers.user_serializer import UserSerializer

class ListAllUsersAPIView(BaseListAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_fields = [
        'first_name',
        'last_name',
        'email',
    ]

    ordering = [
        '-last_name',
    ]
