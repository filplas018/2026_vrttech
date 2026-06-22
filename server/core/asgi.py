"""ASGI configuration for the chat application.

WebSocket support (Channels/Daphne) is temporarily disabled for development.
The original ASGI/Channels configuration is preserved below as comments
so it can be re-enabled later.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

# Simple ASGI application (only HTTP) — websockets disabled
application = get_asgi_application()

# --- Original Channels-based configuration (commented out) ---
# from channels.routing import ProtocolTypeRouter, URLRouter
# # import chat.routing
# from chat.middlewares import JWTAuthCookieMiddleware
#
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
#
# application = ProtocolTypeRouter(
#     {
#         "http": get_asgi_application(),  # Handle traditional HTTP requests
#         "websocket": JWTAuthCookieMiddleware(
#             # URLRouter(chat.routing.websocket_urlpatterns)
#         ),  # Handle WebSocket connections with authentication
#     }
# )
