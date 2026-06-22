from django.db import models
from projects.models.drilling_rig import DrillingRig
from projects.models.order import Order

class DrillingSchedule(models.Model):
    """Harmonogram/Kalendář vytíženosti vrtací techniky"""
    project = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="schedules")
    drilling_rig = models.ForeignKey(DrillingRig, on_delete=models.CASCADE, related_name="schedules")
    start_date = models.DateField()
    end_date = models.DateField()
    is_contracted = models.BooleanField(default=False, help_text="True = Zasmluvněno natvrdo, neposouvat automaticky")

    def __str__(self):
        return f"{self.drilling_rig.name} na {self.project.name} ({self.start_date} - {self.end_date})"