from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Group, Message
from .serializers import GroupSerializer, MessageSerializer
from users.models import User
from django.core.files.storage import default_storage
from backend.settings import MEDIA_BASE_URL
from django.core.files.base import ContentFile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_active_groups(request):
    user = request.user

    if user.role == 'admin':
        groups = Group.objects.all()
    else:
        groups = Group.objects.filter(members=user)

    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_chat_image(request):
    image = request.FILES.get('image')
    if not image:
        return Response({'error': 'Missing image'}, status=400)

    image_path = default_storage.save(f'chat_images/{image.name}', ContentFile(image.read()))
    image_url = default_storage.url(image_path)

    return Response({'content': image_url})