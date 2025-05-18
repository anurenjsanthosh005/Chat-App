from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from django.contrib.auth import get_user_model
import jwt

User = get_user_model()

class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        token = None
        for part in query_string.split('&'):
            if part.startswith('token='):
                token = part.split('=')[1]

        scope['user'] = AnonymousUser()
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user = await database_sync_to_async(User.objects.get)(id=payload.get('user_id'))
                scope['user'] = user
            except Exception:
                pass

        return await self.app(scope, receive, send)