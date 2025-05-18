from rest_framework import serializers
from .models import Group
from users.serializers import UserSerializer

class GroupSerializer(serializers.ModelSerializer):

    type = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name','type','members']

    def get_type(self, obj):
        return "group"
