import json
import logging
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Message

logger = logging.getLogger(__name__)
User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        logger.info(f"Connect called for user: {self.user}")

        if not self.user.is_authenticated:
            logger.info("User not authenticated, closing connection")
            await self.close()
            return

        query_string = self.scope['query_string'].decode()
        receiver_id = None
        for part in query_string.split('&'):
            if part.startswith('receiverId='):
                receiver_id = part.split('=')[1]
        if not receiver_id:
            logger.info("No receiverId found, closing connection")
            await self.close()
            return

        ids = sorted([str(self.user.id), receiver_id])
        self.room_group_name = f'chat_{ids[0]}_{ids[1]}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        logger.info(f"User {self.user} joined room {self.room_group_name}")

        # Fetch serialized past messages (list of dicts)
        messages = await self.get_past_messages(ids[0], ids[1])
        for message in messages:
            await self.send(text_data=json.dumps(message))

    async def disconnect(self, close_code):
        logger.info(f"User {self.user} disconnected from room {getattr(self, 'room_group_name', 'unknown')}")
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        logger.info(f"Message received from {self.user}: {text_data}")
        data = json.loads(text_data)
        message_data = data.get('message', {})

        sender = self.user
        receiver_id = message_data.get('receiverId')
        content = message_data.get('content')

        if not (sender and receiver_id and content):
            logger.warning("Invalid message data, ignoring")
            return

        receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)
        message_obj = await database_sync_to_async(Message.objects.create)(
            sender=sender,
            receiver=receiver,
            content=content
        )

        logger.info(f"Broadcasting message from {sender.id} to room {self.room_group_name}")
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message_obj.id,
                    'senderId': sender.id,
                    'receiverId': receiver.id,
                    'content': content,
                    'timestamp': message_obj.timestamp.isoformat(),
                }
            }
        )

    async def chat_message(self, event):
        logger.info(f"Sending event to client: {event}")
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def get_past_messages(self, user1_id, user2_id):
        messages = Message.objects.filter(
            sender_id__in=[user1_id, user2_id],
            receiver_id__in=[user1_id, user2_id]
        ).select_related('sender', 'receiver').order_by('timestamp')

        # Serialize queryset into list of dicts
        return [
            {
                'id': msg.id,
                'senderId': msg.sender.id,
                'receiverId': msg.receiver.id,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat(),
            }
            for msg in messages
        ]
