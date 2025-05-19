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
    sender = request.user
    group_id = request.data.get('group_id')
    receiver_id = request.data.get('receiver_id')
    image = request.FILES.get('image')

    if not image:
        return Response({'error': 'Missing image'}, status=400)

    # Save image to default storage and get path/url
    image_path = default_storage.save(f'chat_images/{image.name}', ContentFile(image.read()))
    image_url = default_storage.url(image_path)  # URL accessible via MEDIA_URL

    full_image_url = MEDIA_BASE_URL + image_url


    # Use image URL as content and mark is_image=True
    if group_id:
        group = Group.objects.filter(id=group_id).first()
        if not group:
            return Response({'error': 'Group not found'}, status=404)
        if not group.members.filter(id=sender.id).exists():
            return Response({'error': 'You are not a member of this group'}, status=403)
        message = Message.objects.create(sender=sender, group=group, content=image_url, is_image=True)
        serializer = MessageSerializer(message, context={'request': request})
        print("Serialized message data (group):", serializer.data)
        return Response(MessageSerializer(message).data)

    elif receiver_id:
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'error': 'Receiver not found'}, status=404)
        message = Message.objects.create(sender=sender, receiver=receiver, content=image_url, is_image=True)
        serializer = MessageSerializer(message, context={'request': request})
        print("Serialized message data (receiver):", serializer.data)
        return Response(MessageSerializer(message).data)

    else:
        return Response({'error': 'Provide either group_id or receiver_id'}, status=400)