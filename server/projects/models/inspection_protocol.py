from django.db import models
from projects.models.order import Order

class InspectionProtocol(models.Model):
    """Měsíční zjišťovací protokoly odvedené práce"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="inspection_protocols")
    period = models.CharField(max_length=7, help_text="Formát RRRR-MM (např. 2026-06)")
    invoiced_amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Kolik se za tento měsíc vyfakturovalo")
    is_sent = models.BooleanField(default=False, help_text="Zda sekretářka odeslala protokol objednateli")
    admin_signature_hash = models.CharField(max_length=255, blank=True, null=True, help_text="Otisk elektronického podpisu admina")

