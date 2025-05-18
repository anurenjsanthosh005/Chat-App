from django.urls import re_path
from . import consumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/$', consumer.ChatConsumer.as_asgi()),
    re_path(r'^ws/group-chat/$', consumer.GroupChatConsumer.as_asgi()),
]
