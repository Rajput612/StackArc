from django.core.management.base import BaseCommand
from django.db import transaction
from courses.models import Course, Topic, Exercise

class Command(BaseCommand):
    help = 'Populate the database with predefined courses'

    def handle(self, *args, **kwargs):
        with transaction.atomic():
            # Clear existing courses
            Course.objects.all().delete()

            # Define course data
            courses_data = [
                {
                    'id': 'python-basics',
                    'title': 'Python Basics',
                    'description': 'Master fundamental Python concepts: variables, data types, control structures, and functions',
                    'icon': '🐍',
                    'level': 'Beginner',
                    'status': 'available'
                },
                {
                    'id': 'python-advanced',
                    'title': 'Python Advanced',
                    'description': 'Explore advanced topics: decorators, generators, context managers, and metaclasses',
                    'icon': '⚡',
                    'level': 'Advanced',
                    'status': 'available'
                },
                {
                    'id': 'data-structures',
                    'title': 'Data Structures',
                    'description': 'Learn essential data structures: arrays, linked lists, trees, graphs, and hash tables',
                    'icon': '📚',
                    'level': 'Intermediate',
                    'status': 'available'
                },
                {
                    'id': 'algorithms',
                    'title': 'Algorithms',
                    'description': 'Master algorithmic concepts: sorting, searching, dynamic programming, and graph algorithms',
                    'icon': '🔄',
                    'level': 'Advanced',
                    'status': 'available'
                },
                {
                    'id': 'django',
                    'title': 'Django',
                    'description': 'Build web applications with Django: MVT pattern, ORM, authentication, and REST APIs',
                    'icon': '🎯',
                    'level': 'Intermediate',
                    'status': 'available'
                },
                {
                    'id': 'system-design',
                    'title': 'System Design',
                    'description': 'Learn how to design scalable systems and architectures.',
                    'icon': '🖥️',
                    'level': 'Intermediate',
                    'status': 'available'
                },
                {
                    'id': 'prompt-engineering',
                    'title': 'Prompt Engineering',
                    'description': 'Master the art of crafting effective prompts for AI models.',
                    'icon': '💡',
                    'level': 'Advanced',
                    'status': 'available'
                },
                {
                    'id': 'docker',
                    'title': 'Docker',
                    'description': 'Learn containerization, Docker compose, and container orchestration',
                    'icon': '🐳',
                    'level': 'Intermediate',
                    'status': 'available'
                },
                {
                    'id': 'gunicorn',
                    'title': 'Gunicorn',
                    'description': 'Deploy Python web applications with Gunicorn WSGI HTTP Server',
                    'icon': '🦄',
                    'level': 'Intermediate',
                    'status': 'available'
                },
                {
                    'id': 'nginx',
                    'title': 'Nginx',
                    'description': 'Configure and optimize Nginx as a web server, reverse proxy, and load balancer',
                    'icon': '🌐',
                    'level': 'Advanced',
                    'status': 'available'
                },
                {
                    'id': 'sql-mastery',
                    'title': 'SQL Mastery',
                    'description': 'Master SQL database design, queries, optimization, and best practices',
                    'icon': '💾',
                    'level': 'Intermediate',
                    'status': 'coming-soon'
                },
                {
                    'id': 'git-github',
                    'title': 'Git & GitHub',
                    'description': 'Learn version control, collaboration, and project management with Git and GitHub',
                    'icon': '🔄',
                    'level': 'Beginner',
                    'status': 'coming-soon'
                }
            ]

            # Create courses
            for course_data in courses_data:
                course = Course.objects.create(
                    id=course_data['id'],
                    title=course_data['title'],
                    description=course_data['description'],
                    icon=course_data['icon'],
                    level=course_data['level'],
                    status=course_data['status'],
                    is_published=course_data['status'] == 'available'
                )

                # Create topics for available courses
                if course.status == 'available':
                    for i in range(1, 11):  # 10 topics per course
                        topic = Topic.objects.create(
                            course=course,
                            title=f"Topic {i}",
                            slug=f"topic-{i}",
                            description=f"Description for Topic {i}",
                            order=i,
                            is_preview=i <= 2  # First two topics are preview
                        )
                        
                        # Create exercises for each topic
                        for j in range(1, 4):  # 3 exercises per topic
                            Exercise.objects.create(
                                topic=topic,
                                title=f"Exercise {j}",
                                description=f"Description for Exercise {j}",
                                starter_code="# Your code here",
                                test_code="# Test code here",
                                solution_code="# Solution here"
                            )

            self.stdout.write(self.style.SUCCESS('Successfully populated courses'))
