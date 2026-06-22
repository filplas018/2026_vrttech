from django.db import models
from projects.models.order import Order

class Invoice(models.Model):
    """Finanční toky a faktury zakázky"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="invoices")
    invoice_number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    issue_date = models.DateField()
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)
