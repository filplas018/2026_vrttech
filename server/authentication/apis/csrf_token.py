from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.views import APIView


class CsrfTokenApiView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        get_token(request)
        return Response({"detail": "CSRF cookie set."})