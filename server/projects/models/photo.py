from django.db import models
from projects.models.photo_gallery import PhotoGallery

class Photo(models.Model):
    """Jednotlivé fotografie s možností uložení GPS pozice pro mapu"""
    gallery = models.ForeignKey(PhotoGallery, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="project_photos/")
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True, help_text="GPS šířka pro zobrazení na mapě")
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True, help_text="GPS délka pro zobrazení na mapě")
    uploaded_at = models.DateTimeField(auto_now_add=True)