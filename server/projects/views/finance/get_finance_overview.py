from decimal import Decimal
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models.order import Order
from projects.serializers.invoice_serializer import InvoiceSerializer
from projects.serializers.inspection_protocol_serializer import InspectionProtocolSerializer
from projects.serializers.retention_serializer import RetentionSerializer


class GetFinanceOverviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        project_id = kwargs.get('pk')
        order = get_object_or_404(Order, pk=project_id)

        invoices = order.invoices.all()
        protocols = order.inspection_protocols.all()
        retentions = order.retentions.all()

        total_invoiced = invoices.aggregate(
            total=Coalesce(Sum('amount'), Decimal('0.00'))
        )['total']

        total_paid = invoices.filter(is_paid=True).aggregate(
            total=Coalesce(Sum('amount'), Decimal('0.00'))
        )['total']

        total_protocol_amount = protocols.aggregate(
            total=Coalesce(Sum('invoiced_amount'), Decimal('0.00'))
        )['total']

        total_budget = order.total_budget
        total_remaining = total_budget - total_invoiced
        total_retention = retentions.aggregate(
            total=Coalesce(Sum('amount'), Decimal('0.00'))
        )['total']
        released_retention = retentions.filter(is_released=True).aggregate(
            total=Coalesce(Sum('amount'), Decimal('0.00'))
        )['total']
        unreleased_retention = total_retention - released_retention

        invoice_serializer = InvoiceSerializer(invoices, many=True)
        protocol_serializer = InspectionProtocolSerializer(protocols, many=True)
        retention_serializer = RetentionSerializer(retentions, many=True)

        return Response({
            'order_id': order.id,
            'summary': {
                'budget': total_budget,
                'invoiced': total_invoiced,
                'remaining': total_remaining,
                'total_invoiced': total_invoiced,
                'total_paid': total_paid,
                'total_unpaid': total_invoiced - total_paid,
                'total_protocol_amount': total_protocol_amount,
                'retentions': {
                    'total': total_retention,
                    'released': released_retention,
                    'unreleased': unreleased_retention,
                },
            },
            'invoices': invoice_serializer.data,
            'inspection_protocols': protocol_serializer.data,
            'retentions': retention_serializer.data,
        }, status=status.HTTP_200_OK)