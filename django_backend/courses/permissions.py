from rest_framework import permissions

class IsEnrolledOrPreview(permissions.BasePermission):
    """
    Custom permission to only allow enrolled users to access content.
    Preview content is accessible to all authenticated users.
    """

    def has_permission(self, request, view):
        # Allow any authenticated user to list courses and preview content
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow access if the user is enrolled in the course
        if hasattr(obj, 'course'):
            # For Topic and Exercise objects
            course = obj.course
        else:
            # For Course objects
            course = obj

        # Check if the content is preview
        is_preview = False
        if hasattr(obj, 'is_preview'):
            is_preview = obj.is_preview
        elif hasattr(obj, 'topic') and hasattr(obj.topic, 'is_preview'):
            is_preview = obj.topic.is_preview

        # Allow access if content is preview or user is enrolled
        return is_preview or course.enrolled_users.filter(id=request.user.id).exists()
