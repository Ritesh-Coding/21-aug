from django.db import models

# Create your models here.
from authApp.models import Employee
from django.db import models


class Message(models.Model):
    sender = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    first_name = models.CharField()
    timestamp = models.DateTimeField(auto_now_add=True)

   
