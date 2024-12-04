from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .models import UserType

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admins and superadmins.
    """
    def has_permission(self, request, view):
        return (request.user and 
                (request.user.is_admin or request.user.is_superadmin))

class IsSuperAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow superadmins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_superadmin

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Only superadmins can register admin/staff
        user_type = request.data.get('user_type', UserType.STUDENT)
        
        if user_type in [UserType.ADMIN, UserType.STAFF]:
            if not request.user.is_authenticated or not request.user.is_superadmin:
                return Response(
                    {"error": "Only superadmins can register admin or staff users"},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        # Prevent changing user type or critical permissions
        restricted_fields = ['user_type', 'is_course_creator', 'is_content_moderator']
        
        for field in restricted_fields:
            if field in request.data:
                return Response(
                    {"error": f"Cannot modify {field}"},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = UserProfileSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """
        List all users (for admins)
        """
        users = request.user.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)

    def delete(self, request, user_id):
        """
        Delete a user (for admins)
        """
        try:
            user_to_delete = request.user.objects.get(id=user_id)
            
            # Prevent deleting superadmins
            if user_to_delete.is_superadmin:
                return Response(
                    {"error": "Cannot delete superadmin"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            user_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except request.user.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
