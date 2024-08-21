from rest_framework import viewsets, permissions
from .models import ChatMessage
from .serializer import ChatMessageSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
class ChatMessageViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    queryset = ChatMessage.objects.all().order_by('timestamp')
    
    serializer_class = ChatMessageSerializer
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
