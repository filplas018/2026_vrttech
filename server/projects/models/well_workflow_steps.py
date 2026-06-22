from django.db import models
from django.conf import settings
from projects.enums.project_enums import WorkflowStepStatus
from projects.models.order import Order

class WellWorkflowStep(models.Model):
    """Model pro 9 kroků průzkumného vrtu u vrtaných studní na klíč"""
    project = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="workflow_steps")
    step_number = models.PositiveIntegerField(help_text="Číslo kroku 1 až 9")
    status = models.CharField(max_length=20, choices=WorkflowStepStatus.choices, default=WorkflowStepStatus.NOT_STARTED)
    hydrogeologist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, help_text="Přiřazený hydrogeolog")
    completed_at = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('project', 'step_number')
        ordering = ['step_number']