import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from users.models import UserType

def create_users():
    User = get_user_model()

    # Define users to create
    users_to_create = [
        {
            'username': 'student_user',
            'email': 'user@mail.com',
            'password': 'user',
            'user_type': UserType.STUDENT,
            'student_id': 'ST001',
            'first_name': 'Student',
            'last_name': 'User'
        },
        {
            'username': 'staff_user',
            'email': 'staff@mail.com',
            'password': 'staff',
            'user_type': UserType.STAFF,
            'department': 'Education',
            'is_staff': True,
            'first_name': 'Staff',
            'last_name': 'User'
        },
        {
            'username': 'admin_user',
            'email': 'admin@mail.com',
            'password': 'admin',
            'user_type': UserType.ADMIN,
            'department': 'Administration',
            'is_staff': True,
            'is_content_moderator': True,
            'first_name': 'Admin',
            'last_name': 'User'
        },
        {
            'username': 'superadmin_user',
            'email': 'superadmin@mail.com',
            'password': 'superadmin',
            'user_type': UserType.SUPERADMIN,
            'is_staff': True,
            'is_superuser': True,
            'first_name': 'Super',
            'last_name': 'Admin'
        }
    ]

    # Create users
    for user_data in users_to_create:
        # Extract password before creating user
        password = user_data.pop('password')
        
        # Check if user already exists
        if not User.objects.filter(email=user_data['email']).exists():
            # Create user
            user = User.objects.create_user(**user_data)
            user.set_password(password)
            user.save()
            
            print(f'Successfully created {user_data["user_type"]} user: {user_data["email"]}')
        else:
            print(f'User {user_data["email"]} already exists')

    print('Finished creating initial users')

if __name__ == '__main__':
    create_users()
