from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class BaseCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    serializer_class = None

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        instance = self.perform_create(
            serializer
        )

        return Response(
            self.serializer_class(instance).data,
            status=status.HTTP_201_CREATED
        )

    def perform_create(self, serializer):
        return serializer.save()