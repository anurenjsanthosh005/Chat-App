import json
import logging
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Message,Group
from django.conf import settings

logger = logging.getLogger(__name__)
User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return

        query_string = self.scope['query_string'].decode()
        receiver_id = None
        for part in query_string.split('&'):
            if part.startswith('receiverId='):
                receiver_id = part.split('=')[1]

        if not receiver_id:
            await self.close()
            return

        ids = sorted([str(self.user.id), receiver_id])
        self.room_group_name = f'chat_{ids[0]}_{ids[1]}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        messages = await self.get_past_messages(ids[0], ids[1])
        for message in messages:
            await self.send(text_data=json.dumps(message))

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_data = data.get('message', {})

        sender = self.user
        receiver_id = message_data.get('receiverId')
        content = message_data.get('content', '')
        is_image = message_data.get('isImage', False)
        image_url = content if is_image else None

        if not sender or not receiver_id:
            return

        receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)
        message_obj = await database_sync_to_async(Message.objects.create)(
            sender=sender,
            receiver=receiver,
            content=content,
            is_image=is_image,
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message_obj.id,
                    'senderId': sender.id,
                    'receiverId': receiver.id,
                    'content': content,
                    'isImage': bool(image_url),
                    'timestamp': message_obj.timestamp.isoformat(),
                }
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def get_past_messages(self, user1_id, user2_id):
        messages = Message.objects.filter(
            sender_id__in=[user1_id, user2_id],
            receiver_id__in=[user1_id, user2_id]
        ).select_related('sender', 'receiver').order_by('timestamp')

        return [
            {
                'id': msg.id,
                'senderId': msg.sender.id,
                'receiverId': msg.receiver.id,
                'content': msg.content,
                'isImage': msg.is_image,
                'timestamp': msg.timestamp.isoformat(),
            }
            for msg in messages
        ]
    

class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return

        query_string = self.scope['query_string'].decode()
        group_id = None
        for part in query_string.split('&'):
            if part.startswith('groupId='):
                group_id = part.split('=')[1]

        if not group_id:
            await self.close()
            return

        self.group_id = group_id
        self.room_group_name = f'group_chat_{group_id}'

        try:
            group = await database_sync_to_async(Group.objects.get)(id=group_id)
        except Group.DoesNotExist:
            await self.close()
            return

        is_member = await database_sync_to_async(group.members.filter(id=self.user.id).exists)()
        if not is_member:
            await self.close()
            return

        self.group = group

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        messages = await self.get_past_messages(group_id)
        for message in messages:
            await self.send(text_data=json.dumps(message))

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_data = data.get('message', {})
        content = message_data.get('content', '')
        is_image = message_data.get('isImage', False)
        sender = self.user

        if not content:
            return

        msg_obj = await database_sync_to_async(Message.objects.create)(
            sender=sender,
            group=self.group,
            content=content,
            is_image=is_image,
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': msg_obj.id,
                    'senderId': sender.id,
                    'senderName': sender.name,
                    'groupId': self.group_id,
                    'content': content,
                    'isImage': is_image,
                    'timestamp': msg_obj.timestamp.isoformat(),
                }
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def get_past_messages(self, group_id):
        messages = Message.objects.filter(group_id=group_id).select_related('sender').order_by('timestamp')
        return [
            {
                'id': msg.id,
                'senderId': msg.sender.id,
                'senderName': msg.sender.name,
                'groupId': group_id,
                'content': msg.content,
                'isImage': msg.is_image,
                'timestamp': msg.timestamp.isoformat(),
            }
            for msg in messages
        ]
