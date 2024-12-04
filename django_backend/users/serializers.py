from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserType

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    user_type = serializers.ChoiceField(
        choices=UserType.choices, 
        default=UserType.STUDENT
    )

    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'password2', 
            'first_name', 'last_name', 'user_type',
            'student_id', 'department', 'hire_date'
        )
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'student_id': {'required': False},
            'department': {'required': False},
            'hire_date': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Additional validation based on user type
        user_type = attrs.get('user_type', UserType.STUDENT)
        
        if user_type == UserType.STUDENT and not attrs.get('student_id'):
            raise serializers.ValidationError({"student_id": "Student ID is required for students."})
        
        if user_type in [UserType.STAFF, UserType.ADMIN] and not attrs.get('department'):
            raise serializers.ValidationError({"department": "Department is required for staff and admin."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        
        # Set additional permissions based on user type
        if validated_data['user_type'] == UserType.ADMIN:
            validated_data['is_staff'] = True
        
        if validated_data['user_type'] == UserType.SUPERADMIN:
            validated_data['is_staff'] = True
            validated_data['is_superuser'] = True
        
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'profile_picture', 'bio', 'date_of_birth', 
            'user_type', 'student_id', 'department', 'hire_date',
            'is_course_creator', 'is_content_moderator'
        )
        read_only_fields = (
            'id', 'username', 'email', 'user_type', 
            'is_course_creator', 'is_content_moderator'
        )
