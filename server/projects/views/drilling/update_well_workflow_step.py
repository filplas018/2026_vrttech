from django.http import Http404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from projects.models import WellWorkflowStep
from projects.serializers import WellWorkflowStepSerializer
from projects.enums.project_enums import WorkflowStepStatus
from projects.views.base_patch_api_view import BasePatchAPIView


class UpdateWellWorkflowStepAPIView(BasePatchAPIView):
    HYDROGEOLOGIST_STEPS = [2, 5, 7]

    model = WellWorkflowStep
    serializer_class = WellWorkflowStepSerializer
    

    def patch(self, request, *args, **kwargs):
        project_id = kwargs.get('pk')
        step_number = int(kwargs.get('step_number'))

        step_was_created = False
        try:
            step = self.get_object(project_id=project_id, step_number=step_number)
        except Http404:
            if not (request.user.is_staff or request.user.is_superuser):
                raise

            step_was_created = True
            step_data = request.data.copy()
            step_data['project'] = project_id
            step_data['step_number'] = step_number
            serializer = WellWorkflowStepSerializer(data=step_data)

        # User model nema role field; hydrogeologicke kroky proto mohou menit pouze staff.
        if step_number in self.HYDROGEOLOGIST_STEPS:
            if not (request.user.is_staff or request.user.is_superuser):
                return Response(
                    {"detail": f"Krok {step_number} vyžaduje schválení hydrogeologem."},
                    status=status.HTTP_403_FORBIDDEN
                )

        if not step_was_created:
            serializer = WellWorkflowStepSerializer(step, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data.get('status')
        if new_status == WorkflowStepStatus.DONE:
            serializer.validated_data['completed_at'] = timezone.localdate()
        elif new_status is not None and new_status != WorkflowStepStatus.DONE:
            serializer.validated_data['completed_at'] = None

        serializer.save()
        response_status = status.HTTP_201_CREATED if step_was_created else status.HTTP_200_OK
        return Response(serializer.data, status=response_status)