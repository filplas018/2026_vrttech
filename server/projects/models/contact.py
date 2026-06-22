from django.db import models
from projects.enums.project_enums import ContactType

class Contact(models.Model):
    """Adresář osob (investoři, stavbyvedoucí)"""
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    company = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"