from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Course(models.Model):
    DIFFICULTY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('coming-soon', 'Coming Soon'),
    ]

    id = models.CharField(max_length=50, primary_key=True)  # Using slug as ID
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='📚')
    level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    duration = models.IntegerField(help_text="Total duration in minutes", default=120)
    is_published = models.BooleanField(default=True)
    enrolled_users = models.ManyToManyField(User, through='UserCourseProgress')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']

class Topic(models.Model):
    course = models.ForeignKey(Course, related_name='topics', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField()
    is_preview = models.BooleanField(default=False)
    content = models.TextField(blank=True)
    slug = models.SlugField(max_length=200)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

    class Meta:
        ordering = ['course', 'order']
        unique_together = [['course', 'order'], ['course', 'slug']]

class Exercise(models.Model):
    topic = models.ForeignKey(Topic, related_name='exercises', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    starter_code = models.TextField(blank=True)
    test_code = models.TextField(blank=True)
    solution_code = models.TextField(blank=True)

    def __str__(self):
        return f"{self.topic.title} - {self.title}"

    class Meta:
        ordering = ['topic', 'id']

class UserCourseProgress(models.Model):
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')
    completed_topics = models.ManyToManyField(Topic)
    enrolled_at = models.DateTimeField(auto_now_add=True)  # Ensure this field exists
    last_accessed = models.DateTimeField(auto_now=True)    # Ensure this field exists

    class Meta:
        unique_together = ['user', 'course']

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"
