from rest_framework import serializers
from .models import Group, Message
from users.serializers import UserSerializer

class GroupSerializer(serializers.ModelSerializer):

    type = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name','type','members']

    def get_type(self, obj):
        return "group"

class MessageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.is_image:
            request = self.context.get('request')
            if obj.content:
                if request:
                    return request.build_absolute_uri(obj.content)
                return obj.content
        return None
