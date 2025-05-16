from django.urls import path
from .views import MyTokenObtainPairView,get_active_users
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', get_active_users, name='get_active_users'),
]
