from django.core.management.base import BaseCommand
from courses.models import Category

class Command(BaseCommand):
    help = 'Populate the database with sample categories'

    def handle(self, *args, **kwargs):
        categories = {
            'Data Science': 'data-science-icon',
            'Web Development': 'web-development-icon',
            'Machine Learning': 'machine-learning-icon',
            'Deployment': 'deployment-icon',
            'Basics': 'basics-icon',
            'Data Structures and Algorithms': 'data-structures-icon',
            'CI & CD': 'ci-cd-icon',
            'Databases': 'databases-icon',
            'System Architecture': 'system-architecture-icon',
        }
        for name, icon in categories.items():
            category, created = Category.objects.get_or_create(name=name, defaults={'icon': icon})
            if created:
                self.stdout.write(self.style.SUCCESS(f'Category created: {name} with icon: {icon}'))
            else:
                self.stdout.write(self.style.WARNING(f'Category already exists: {name}'))
