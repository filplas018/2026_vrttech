from projects.models.document import Document
from projects.serializers.document_serializer import DocumentSerializer
from projects.views.base_list_api_view import BaseListAPIView


class ListDocumentsAPIView(BaseListAPIView):

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    filter_fields = [
        'file_name',
        'document_type',
        'uploaded_at',
    ]

    select_related = [
        'order',
    ]

    ordering = [
        '-uploaded_at',
    ]

    def get_queryset(self):
        # 1. Zavolá get_queryset() z BaseListAPIView (přidá select_related/prefetch_related)
        queryset = super().get_queryset()

        # 2. Vytáhne pk z URL (/projects/<pk>/documents/) a dofiltruje pouze dokumenty dané zakázky
        project_id = self.kwargs.get('pk')
        return queryset.filter(order_id=project_id)