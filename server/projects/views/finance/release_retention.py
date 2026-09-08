from rest_framework import status
from rest_framework.response import Response
from projects.models import Retention
from projects.serializers import RetentionSerializer
from projects.views.base_patch_api_view import BasePatchAPIView


class ReleaseRetentionAPIView(BasePatchAPIView):
    model = Retention
    serializer_class = RetentionSerializer

    def patch(self, request, *args, **kwargs):
        retention = self.get_object(pk=kwargs.get('pk'))

        if retention.is_released:
            return Response(
                {"detail": "Tato pozastávka již byla uvolněna."},
                status=status.HTTP_400_BAD_REQUEST
            )

        retention.is_released = True
        retention.save(update_fields=['is_released'])

        serializer = self.serializer_class(retention)
        return Response(
            {
                "message": "Pozastávka byla úspěšně uvolněna.",
                "retention": serializer.data
            },
            status=status.HTTP_200_OK
        )