from django.urls import path
from django.views import View

# --- OPRAVENÝ POMOCNÝ DISPATCHER ---
def route_by_method(get_view=None, post_view=None, patch_view=None, delete_view=None):
    """
    Umožňuje namapovat více samostatných APIView tříd na jedno URL podle HTTP metody.
    Dědí z čistého Django View, aby nedocházelo k dvojitému balení requestu do DRF.
    """
    class DispatchedView(View):
        def dispatch(self, request, *args, **kwargs):
            method = request.method.lower()
            
            if method == 'get' and get_view:
                return get_view.as_view()(request, *args, **kwargs)
            if method == 'post' and post_view:
                return post_view.as_view()(request, *args, **kwargs)
            if method == 'patch' and patch_view:
                return patch_view.as_view()(request, *args, **kwargs)
            if method == 'delete' and delete_view:
                return delete_view.as_view()(request, *args, **kwargs)
            
            # Pokud metoda není podporována, standardní Django vrátí 405 Method Not Allowed
            return super().dispatch(request, *args, **kwargs)

    return DispatchedView.as_view()


# --- IMPORTY JEDNOTLIVÝCH VIEWS ---

# 1. Projects
from projects.views.projects.list_projects import ListProjectsAPIView
from projects.views.projects.create_project import CreateProjectAPIView
from projects.views.projects.get_project import GetProjectAPIView
from projects.views.projects.update_project import UpdateProjectAPIView
from projects.views.projects.assign_contact import AssignContactAPIView

# 2. Visits
from projects.views.visits.list_my_visits import ListMyVisitsAPIView
from projects.views.visits.create_visit import CreateVisitAPIView
from projects.views.visits.get_conditions import GetConditionsAPIView
from projects.views.visits.create_conditions import CreateConditionsAPIView

# 3. Drilling
from projects.views.drilling.list_rigs import ListRigsAPIView
from projects.views.drilling.list_schedule import ListScheduleAPIView
from projects.views.drilling.create_schedule import CreateScheduleAPIView
from projects.views.drilling.update_schedule import UpdateScheduleAPIView
from projects.views.drilling.get_technical_report import GetTechnicalReportAPIView
from projects.views.drilling.create_technical_report import CreateTechnicalReportAPIView
from projects.views.drilling.get_well_workflow import GetWellWorkflowAPIView
from projects.views.drilling.update_well_workflow_step import UpdateWellWorkflowStepAPIView

# 4. Documents
from projects.views.documents.list_documents import ListDocumentsAPIView
from projects.views.documents.upload_document import UploadDocumentAPIView
from projects.views.documents.create_gallery import CreateGalleryAPIView
from projects.views.documents.upload_photo import UploadPhotoAPIView

# 5. Finance
from projects.views.finance.get_finance_overview import GetFinanceOverviewAPIView
from projects.views.finance.create_invoice import CreateInvoiceAPIView
from projects.views.finance.update_invoice_status import UpdateInvoiceStatusAPIView
from projects.views.finance.create_protocol import CreateProtocolAPIView
from projects.views.finance.sign_protocol import SignProtocolAPIView
from projects.views.finance.send_protocol import SendProtocolAPIView
from projects.views.finance.release_retention import ReleaseRetentionAPIView


# --- URLPATTERNS MAPPING ---

urlpatterns = [
    # === 1. PROJECTS ===
    path('projects/', route_by_method(get_view=ListProjectsAPIView, post_view=CreateProjectAPIView), name='projects-root'),
    path('projects/<int:pk>/', route_by_method(get_view=GetProjectAPIView, patch_view=UpdateProjectAPIView), name='projects-detail'),
    path('projects/<int:pk>/assign-contact/', AssignContactAPIView.as_view(), name='projects-assign-contact'),

    # === 2. SITE VISITS ===
    path('site-visits/', route_by_method(post_view=CreateVisitAPIView), name='visits-root'),
    path('site-visits/my-visits/', ListMyVisitsAPIView.as_view(), name='visits-my-visits'),
    path('site-visits/<int:pk>/conditions/', route_by_method(get_view=GetConditionsAPIView, post_view=CreateConditionsAPIView), name='visits-conditions'),

    # === 3. DRILLING ===
    path('drilling-rigs/', ListRigsAPIView.as_view(), name='drilling-rigs'),
    path('drilling-schedule/', route_by_method(get_view=ListScheduleAPIView, post_view=CreateScheduleAPIView), name='drilling-schedule'),
    path('drilling-schedule/<int:pk>/', route_by_method(patch_view=UpdateScheduleAPIView), name='drilling-schedule-detail'),
    path('projects/<int:pk>/technical-report/', route_by_method(get_view=GetTechnicalReportAPIView, post_view=CreateTechnicalReportAPIView), name='projects-technical-report'),
    path('projects/<int:pk>/well-workflow/', GetWellWorkflowAPIView.as_view(), name='projects-well-workflow'),
    path('projects/<int:pk>/well-workflow/<int:step_number>/', route_by_method(patch_view=UpdateWellWorkflowStepAPIView), name='projects-well-workflow-step'),

    # === 4. DOCUMENTS & GALLERIES ===
    path('projects/<int:pk>/documents/', route_by_method(get_view=ListDocumentsAPIView, post_view=UploadDocumentAPIView), name='projects-documents'),
    path('projects/<int:pk>/galleries/', route_by_method(post_view=CreateGalleryAPIView), name='projects-galleries'),
    path('galleries/<int:gallery_id>/photos/', route_by_method(post_view=UploadPhotoAPIView), name='gallery-photos'),

    # === 5. FINANCE & PROTOCOLS ===
    path('projects/<int:pk>/finance-overview/', GetFinanceOverviewAPIView.as_view(), name='projects-finance-overview'),
    path('projects/<int:pk>/invoices/', route_by_method(post_view=CreateInvoiceAPIView), name='projects-invoices'),
    path('invoices/<int:pk>/', route_by_method(patch_view=UpdateInvoiceStatusAPIView), name='invoice-detail'),
    path('projects/<int:pk>/inspection-protocols/', route_by_method(post_view=CreateProtocolAPIView), name='projects-protocols'),
    path('inspection-protocols/<int:pk>/sign/', SignProtocolAPIView.as_view(), name='protocol-sign'),
    path('inspection-protocols/<int:pk>/send/', SendProtocolAPIView.as_view(), name='protocol-send'),
    path('retentions/<int:pk>/release/', ReleaseRetentionAPIView.as_view(), name='retention-release'),
]