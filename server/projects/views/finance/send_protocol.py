from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import InspectionProtocol
from projects.serializers.inspection_protocol_serializer import InspectionProtocolSerializer


class SendProtocolAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        protocol_id = kwargs.get('pk')
        protocol = get_object_or_404(InspectionProtocol, pk=protocol_id)

        # ------------------------------------------------------------------
        # TODO: Zde bude logika pro vygenerování PDF a odeslání na e-mail
        # client_email = protocol.order.client.email
        # send_mail_with_attachment(to=client_email, ...)
        # ------------------------------------------------------------------

        # Označení protokolu jako odeslaný
        protocol.is_sent = True
        protocol.save(update_fields=['is_sent'])

        serializer = InspectionProtocolSerializer(protocol)
        return Response(
            {
                "message": f"Protokol pro období {protocol.period} byl úspěšně označen jako odeslaný.",
                "protocol": serializer.data,
            },
            status=status.HTTP_200_OK
        )