from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class BaseListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    queryset = None
    serializer_class = None

    filter_fields = []

    allowed_lookups = {
        'exact',
        'contains',
        'icontains',
        'startswith',
        'istartswith',
        'endswith',
        'iendswith',
        'gt',
        'gte',
        'lt',
        'lte',
        'in',
        'isnull',
        'year',
        'month',
        'day',
    }

    ordering = None

    select_related = []
    prefetch_related = []

    def get_queryset(self):
        queryset = self.queryset.all()

        if self.select_related:
            queryset = queryset.select_related(
                *self.select_related
            )

        if self.prefetch_related:
            queryset = queryset.prefetch_related(
                *self.prefetch_related
            )

        return queryset

    def filter_queryset(self, queryset):
        for field in self.filter_fields:

            # ----------------------------------------
            # Exact lookup
            # ?name=Test
            # ?order=123
            # ----------------------------------------
            value = self.request.query_params.get(field)

            if value is not None and value != '':
                queryset = queryset.filter(
                    **{field: value}
                )

            # ----------------------------------------
            # Lookup filtry
            # ?name__icontains=test
            # ?price__gte=100
            # ?price__lte=500
            # ----------------------------------------
            for lookup in self.allowed_lookups:
                param = f'{field}__{lookup}'

                value = self.request.query_params.get(param)

                if value is None or value == '':
                    continue

                # __in
                # ?status__in=NEW,ACTIVE,DONE
                if lookup == 'in':
                    value = [
                        item.strip()
                        for item in value.split(',')
                        if item.strip()
                    ]

                # __isnull
                # ?deleted_at__isnull=true
                elif lookup == 'isnull':
                    value = value.lower() in (
                        'true',
                        '1',
                        'yes',
                    )

                queryset = queryset.filter(
                    **{param: value}
                )

        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        queryset = self.filter_queryset(
            queryset
        )

        if self.ordering:
            queryset = queryset.order_by(
                *self.ordering
            )

        serializer = self.serializer_class(
            queryset,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )