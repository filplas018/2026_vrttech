from django.db import models

from projects.enums.project_enums import CuttingsDisposal
from projects.models.site_visit import SiteVisit


class Checklist(models.Model):
    """Splněnost podmínek zjištěná při návštěvě (3 klíčové otázky + poznámka)"""
    site_visit = models.OneToOneField(SiteVisit, on_delete=models.CASCADE, related_name="conditions")
    cuttings_disposal = models.CharField(max_length=20, choices=CuttingsDisposal.choices)
    has_electricity_25a = models.BooleanField(default=False, help_text="Možnost připojení k el. síti min 25 A")
    has_water_connection = models.BooleanField(default=False, help_text="Připojení k vodě")
    general_note = models.TextField(blank=True, null=True, help_text="Poznámka pro všechny")