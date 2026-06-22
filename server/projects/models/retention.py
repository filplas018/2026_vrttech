from django.db import models
from projects.enums.project_enums import RetentionType
from projects.models.order import Order

class Retention(models.Model):
    """Finanční pozastávky (zádrže)"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="retentions")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    retention_type = models.CharField(max_length=30, choices=RetentionType.choices)
    release_date = models.DateField(help_text="Předpokládané nebo smluvní datum uvolnění")
    is_released = models.BooleanField(default=False)