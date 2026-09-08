from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class BaseGetAPIView(APIView):
    permission_classes = [IsAuthenticated]

    queryset = None
    serializer_class = None

    lookup_field = 'pk'

    select_related = []
    prefetch_related = []

    def get_queryset(self):
        queryset = self.queryset.all()

        if self.select_related:
            queryset = queryset.select_related(*self.select_related)

        if self.prefetch_related:
            queryset = queryset.prefetch_related(*self.prefetch_related)

        return queryset

    def get_object(self):
        queryset = self.get_queryset()
        lookup_url_kwarg = self.lookup_field
        
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        return get_object_or_404(queryset, **filter_kwargs)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )