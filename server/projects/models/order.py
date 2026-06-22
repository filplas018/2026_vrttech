
from projects.enums.project_enums import CustomerInterest, ProjectStatus, ProjectStatus, ProjectType
from django.db import models
from django.utils.translation import gettext_lazy as _

class Order(models.Model):
    
    order_number = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    
    
    order_type = models.CharField(
        max_length=20,
        choices=ProjectType.choices,  # Tímto Django vygeneruje select box ve formulářích
        default=ProjectType.STUDNA,   # Výchozí hodnota
    )
    
    order_state = models.CharField(
        max_length=20,
        choices=ProjectStatus.choices,
        default=ProjectStatus.POPTAVKA,
    )

    customer_interest = models.CharField(max_length=20, choices=CustomerInterest.choices, default=CustomerInterest.CEKA_SE)
    
    total_budget = models.DecimalField(max_length=12, decimal_places=2, max_digits=12, default=0.0)
    warranty_from = models.DateField(null=True, blank=True)
    warranty_to = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.order_number} - {self.name}"