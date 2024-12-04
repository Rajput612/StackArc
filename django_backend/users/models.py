from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class UserType(models.TextChoices):
    STUDENT = 'ST', _('Student')
    STAFF = 'SF', _('Staff')
    ADMIN = 'AD', _('Admin')
    SUPERADMIN = 'SA', _('Super Admin')

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # User type with choices
    user_type = models.CharField(
        max_length=2,
        choices=UserType.choices,
        default=UserType.STUDENT
    )
    
    # Additional fields for different user types
    student_id = models.CharField(max_length=50, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    
    # Permissions
    is_course_creator = models.BooleanField(default=False)
    is_content_moderator = models.BooleanField(default=False)
    
    # Resolve reverse accessor conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    
    @property
    def is_student(self):
        return self.user_type == UserType.STUDENT
    
    @property
    def is_staff_member(self):
        return self.user_type in [UserType.STAFF, UserType.ADMIN, UserType.SUPERADMIN]
    
    @property
    def is_admin(self):
        return self.user_type in [UserType.ADMIN, UserType.SUPERADMIN]
    
    @property
    def is_superadmin(self):
        return self.user_type == UserType.SUPERADMIN
    
    def has_perm(self, perm, obj=None):
        """
        Custom permission checking based on user type
        """
        if self.is_superadmin:
            return True
        
        # Add more granular permission checks here
        if perm == 'can_create_course' and self.is_content_moderator:
            return True
        
        return super().has_perm(perm, obj)
