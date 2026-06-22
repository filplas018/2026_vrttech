from django.db import models
from projects.models.order import Order

class PhotoGallery(models.Model):
    """Galerie pro zakázku (např. Průběh realizace, Terénní obhlídka)"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="galleries")
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.order.name} - {self.name}"