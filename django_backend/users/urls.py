from django.urls import path
from .views import (
    UserRegistrationView, 
    UserLoginView, 
    UserLogoutView, 
    UserProfileView,
    UserManagementView
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    # Authentication Endpoints
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('logout/', UserLogoutView.as_view(), name='user_logout'),
    
    # Profile Endpoints
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    # User Management Endpoints (Admin Only)
    path('manage/', UserManagementView.as_view(), name='user_management_list'),
    path('manage/<int:user_id>/', UserManagementView.as_view(), name='user_management_detail'),
    
    # JWT Token URLs
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
