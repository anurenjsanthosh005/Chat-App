from django.urls import path
from .views import get_active_groups, upload_chat_image

urlpatterns = [
    path('groups/', get_active_groups, name='get_active_groups'),
    path('upload-image/', upload_chat_image, name='upload_chat_image'),

]
