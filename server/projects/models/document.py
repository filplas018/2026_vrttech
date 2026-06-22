from django.db import models
from projects.enums.project_enums import DocumentType
from projects.models.order import Order

class Document(models.Model):
    """Povolení, projekty, smlouvy a jiné přílohy zakázky"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="documents")
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_with="project_docs/")
    document_type = models.CharField(max_length=30, choices=DocumentType.choices)
    uploaded_at = models.DateTimeField(auto_now_add=True)