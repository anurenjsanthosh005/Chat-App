from django.conf import settings
from django.db import models

class Group(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_groups')

    def __str__(self):
        return self.name

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', null=True, blank=True, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, related_name='messages', null=True, blank=True, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.group:
            return f'{self.sender} -> Group {self.group.name}: {self.content[:20]}'
        else:
            return f'{self.sender} -> {self.receiver}: {self.content[:20]}'
