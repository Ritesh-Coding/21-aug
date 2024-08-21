from rest_framework import serializers
from .models import Message

#created By Ritesh
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'message', 'timestamp','first_name']