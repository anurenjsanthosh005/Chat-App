from django.urls import path
from .views import get_active_groups

urlpatterns = [
    path('groups/', get_active_groups, name='get_active_groups'),
]
