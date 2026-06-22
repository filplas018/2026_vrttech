from django.db import models

class DrillingRig(models.Model):
    """Evidence vrtací techniky"""
    name = models.CharField(max_length=100)
    registration = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name