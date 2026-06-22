from django.db import models
from django.conf import settings
from projects.models.order import Order

class TechnicalReport(models.Model):
    """Technická zpráva vrtu vyplňovaná vrtmistrem"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="technical_reports")
    driller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, help_text="Vrtmistr, který zprávu vyplnil")
    filled_at = models.DateTimeField(auto_now_add=True)
    depth_meters = models.DecimalField(max_digits=5, decimal_places=2)
    technical_specifications = models.TextField(help_text="Specifická data o vrtu")
    alert_driller = models.BooleanField(default=True, help_text="Upozorňovat vrtmistra na vyplnění")