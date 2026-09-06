from projects.views.base_list_api_view import BaseListAPIView
from projects.models import PhotoGallery as Gallery
from projects.serializers.photo_gallery_serializer import PhotoGallerySerializer as GallerySerializer


class ListAllGalleriesAPIView(BaseListAPIView):

    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer

    filter_fields = [
            'name',            
        ]
    
    select_related = [
        'order',
    ]

    prefetch_related = [
        'photos',
    ]

    ordering = [
        '-name',
    ]

    def get_queryset(self):
        # 1. Zavolá get_queryset() z BaseListAPIView (přidá select_related/prefetch_related)
        queryset = super().get_queryset()

        # 2. Vytáhne pk z URL (/projects/<pk>/documents/) a dofiltruje pouze dokumenty dané zakázky
        project_id = self.kwargs.get('pk')
        return queryset.filter(order_id=project_id)