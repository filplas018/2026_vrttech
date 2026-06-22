from django.db import models
from django.conf import settings

from projects.models.order import Order

class SiteVisit(models.Model):
    """Komunikace, schůzky a návštěvy staveniště"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="site_visits")
    assigned_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, help_text="Uživatel, který má místo navštívit")
    planned_at = models.DateTimeField()
    location = models.CharField(max_length=255)
    has_project_documentation = models.BooleanField(default=False, help_text="Zda má zákazník projektovou dokumentaci")

    def __str__(self):
        return f"Návštěva pro {self.project.name} - {self.planned_at.date()}"