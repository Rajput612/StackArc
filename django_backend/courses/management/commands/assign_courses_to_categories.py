from django.core.management.base import BaseCommand
from courses.models import Course, Category
from fuzzywuzzy import process

class Command(BaseCommand):
    help = 'Assign courses to their respective categories using fuzzy matching'

    def handle(self, *args, **kwargs):
        course_category_mapping = {
            'Python Basics': ['Basics'],
            'HTML & CSS Fundamentals': ['Basics'],
            'Data Structures in Python': ['Data Structures and Algorithms'],
            'Algorithm Design': ['Data Structures and Algorithms'],
            'Deploying Python Applications': ['Deployment'],
            'Web App Deployment with Docker': ['Deployment'],
            'Introduction to Machine Learning': ['Machine Learning'],
            'Deep Learning with TensorFlow': ['Machine Learning'],
            'Full Stack Web Development': ['Web Development'],
            'JavaScript Basics': ['Web Development'],
            'Data Analysis with Pandas': ['Data Science'],
            'Data Visualization with Matplotlib': ['Data Science'],
        }

        for course_title, category_names in course_category_mapping.items():
            # Use fuzzy matching to find the closest course title
            course_titles = Course.objects.values_list('title', flat=True)
            matched_title, score = process.extractOne(course_title, course_titles)

            if score >= 80:  # Adjust the threshold as necessary
                try:
                    course = Course.objects.get(title=matched_title)
                    categories = Category.objects.filter(name__in=category_names)
                    course.categories.set(categories)
                    self.stdout.write(self.style.SUCCESS(f'Assigned {matched_title} to categories: {", ".join(category_names)}'))
                except Course.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Course not found: {matched_title}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error assigning categories to {matched_title}: {str(e)}'))
            else:
                self.stdout.write(self.style.WARNING(f'No close match found for: {course_title}'))

        self.stdout.write(self.style.SUCCESS('Course assignments completed.'))