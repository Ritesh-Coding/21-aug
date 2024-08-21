import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from authApp.models import Employee

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.admin_id = int(self.scope['url_route']['kwargs']['admin_id'])
        self.user_id = int(self.scope['url_route']['kwargs']['employee_id'])
        
        # Sort 
        sorted_ids = sorted([self.admin_id, self.user_id])
        self.room_group_name = f"chat_{sorted_ids[0]}_{sorted_ids[1]}"
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        message = data['message']
        sender_id = data['senderId']
        recipient_id = data['recipientId']
        first_name = data['first_name']

        await self.save_message(sender_id, recipient_id, message,first_name)

        # Send message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'recipientId': recipient_id,
                'senderId': sender_id,
                'first_name':first_name
            }
        )
        # Send message back to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'recipient': recipient_id,
            'sender': sender_id,
            'first_name':first_name
        }))

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['senderId']
        recipient_id = event['recipientId']
        first_name = event['first_name']
        await self.send(text_data=json.dumps({
            'message': message,
            'senderId': sender_id,
            'recipientId': recipient_id,
            'first_name':first_name
        }))

    @database_sync_to_async
    def save_message(self, user_id, receiver_id, message,first_name):
        Message.objects.create(sender_id=user_id, recipient_id=receiver_id, message=message,first_name = first_name)