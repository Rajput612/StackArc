from django.contrib import admin
from .models import Course, Topic, Exercise, UserCourseProgress

# Register your models here.

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'level', 'status', 'is_published']
    list_filter = ['level', 'status', 'is_published']
    search_fields = ['title', 'description']
    ordering = ['title']

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'is_preview']
    list_filter = ['course', 'is_preview']
    search_fields = ['title', 'description']
    ordering = ['course', 'order']

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['title', 'topic']
    list_filter = ['topic__course']
    search_fields = ['title', 'description']
    ordering = ['topic', 'id']

@admin.register(UserCourseProgress)
class UserCourseProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'status', 'enrolled_at', 'last_accessed']
    list_filter = ['status', 'course']
    search_fields = ['user__username', 'course__title']
    date_hierarchy = 'enrolled_at'
    readonly_fields = ['enrolled_at', 'last_accessed']
