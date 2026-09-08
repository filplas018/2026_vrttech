from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class BasePatchAPIView(APIView):
    """Bázová třída pro čištění a unifikaci PATCH operací."""
    permission_classes = [IsAuthenticated]
    model = None
    serializer_class = None

    def get_object(self, **kwargs):
        lookup_filter = {key: val for key, val in kwargs.items() if val is not None}
        return get_object_or_404(self.model, **lookup_filter)

    def patch(self, request, *args, **kwargs):
        obj = self.get_object(**kwargs)
        serializer = self.serializer_class(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)