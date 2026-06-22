from projects.models.order import Order
from projects.models.contact import Contact
from projects.enums.project_enums import ContactType
from django.db import models

class ProjectContact(models.Model):
    """Spojovací tabulka určující roli člověka na dané zakázce"""
    project = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="project_contacts")
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    contact_type = models.CharField(max_length=20, choices=ContactType.choices)