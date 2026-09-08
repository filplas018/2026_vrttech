from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models.contact import Contact
from projects.models.order import Order
from projects.models.order_contact import ProjectContact
from projects.serializers.crud.assign_contact_serializer import AssignContactSerializer


class AssignContactAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Validace těla požadavku
        serializer = AssignContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contact_id = serializer.validated_data['contact_id']
        contact_type = serializer.validated_data['contact_type']

        # 2. Načtení zakázky podle 'pk' z URL a kontaktu
        project_id = kwargs.get('pk')
        order = get_object_or_404(Order, pk=project_id)
        contact = get_object_or_404(Contact, pk=contact_id)

        # 3. Vytvoření nebo aktualizace role na zakázce (update_or_create prepíše starý kontakt)
        project_contact, created = ProjectContact.objects.update_or_create(
            project=order,  # Případně project=order podle názvu FK v modelu
            contact_type=contact_type,
            defaults={'contact': contact}
        )

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK

        return Response(
            {
                "message": f"Kontakt '{contact}' byl úspěšně přiřazen k zakázce '{order}'.",
                "project_contact_id": project_contact.id,
                "contact_type": project_contact.contact_type,
            },
            status=status_code
        )