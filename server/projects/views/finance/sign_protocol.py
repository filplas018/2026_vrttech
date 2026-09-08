import hashlib
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.crypto import salted_hmac
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import InspectionProtocol
from projects.serializers.inspection_protocol_serializer import InspectionProtocolSerializer


class SignProtocolAPIView(APIView):
    # Vyžadujeme přihlášení a ideálně roli administrátora / staff
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        protocol_id = kwargs.get('pk')
        protocol = get_object_or_404(InspectionProtocol, pk=protocol_id)

        # 1. Kontrola, zda už protokol není podepsán (volitelné)
        if protocol.admin_signature_hash:
            return Response(
                {"detail": "Tento protokol již byl podepsán."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Příprava dat pro podpis (payload)
        now_str = timezone.now().isoformat()
        payload = (
            f"protocol_id:{protocol.id}|"
            f"order_id:{protocol.order_id}|"
            f"period:{protocol.period}|"
            f"amount:{protocol.invoiced_amount}|"
            f"signed_by:{request.user.id}|"
            f"timestamp:{now_str}"
        )

        # 3. Vygenerování zabezpečeného HMAC-SHA256 hashe s použitím SECRET_KEY
        signature_hash = salted_hmac(
            key_salt="projects.inspection_protocol.signature",
            value=payload,
            secret=None  # Použije automaticky settings.SECRET_KEY
        ).hexdigest()

        # 4. Uložení protokolu
        protocol.admin_signature_hash = signature_hash
        protocol.save(update_fields=['admin_signature_hash'])

        # 5. Navrácení odpovědi se serializovaným protokolem
        serializer = InspectionProtocolSerializer(protocol)
        return Response(
            {
                "message": "Protokol byl úspěšně elektronicky podepsán.",
                "protocol": serializer.data,
            },
            status=status.HTTP_200_OK
        )