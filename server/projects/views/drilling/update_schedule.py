from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from projects.models import DrillingSchedule
from projects.serializers import DrillingRigScheduleSerializer
from projects.views.base_patch_api_view import BasePatchAPIView


class UpdateScheduleAPIView(BasePatchAPIView):
    model = DrillingSchedule
    serializer_class = DrillingRigScheduleSerializer

    @transaction.atomic
    def patch(self, request, *args, **kwargs):
        schedule = self.get_object(pk=kwargs.get('pk'))
        old_start = schedule.start_date
        
        serializer = self.serializer_class(schedule, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_schedule = serializer.save()

        # Pokud došlo ke změně termínu, přepočítáme navazující ne-smluvní termíny
        new_start = updated_schedule.start_date
        if new_start != old_start:
            delta = new_start - old_start
            
            # Vybereme následující termíny, které NEJSOU smluvně svázané
            subsequent_slots = DrillingSchedule.objects.filter(
                start_date__gt=old_start,
                is_contracted=False
            ).exclude(pk=updated_schedule.pk).order_by('start_date')

            for slot in subsequent_slots:
                slot.start_date += delta
                if slot.end_date:
                    slot.end_date += delta
                slot.save(update_fields=['start_date', 'end_date'])

        return Response(serializer.data, status=status.HTTP_200_OK)