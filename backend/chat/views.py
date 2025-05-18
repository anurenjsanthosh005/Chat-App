from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Group
from .serializers import GroupSerializer

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
