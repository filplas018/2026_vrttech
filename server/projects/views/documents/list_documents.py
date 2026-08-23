from projects.models.document import Document
from projects.serializers.document_serializer import DocumentSerializer
from projects.views.base_list_api_view import BaseListAPIView


class ListDocumentsAPIView(BaseListAPIView):

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    filter_fields = [
        'order',
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