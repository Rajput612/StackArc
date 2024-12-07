from rest_framework import serializers
from .models import Course, Topic, Exercise, UserCourseProgress

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'title', 'description', 'initial_code', 'order']

class ExerciseDetailSerializer(ExerciseSerializer):
    class Meta(ExerciseSerializer.Meta):
        fields = ExerciseSerializer.Meta.fields + ['solution', 'test_cases']

class TopicListSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    is_accessible = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ['id', 'slug', 'title', 'description', 'duration', 'difficulty', 
                 'order', 'is_preview', 'is_completed', 'is_accessible']

    def get_is_completed(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        progress = UserCourseProgress.objects.filter(
            user=user, course=obj.course
        ).first()
        return progress and obj in progress.completed_topics.all()

    def get_is_accessible(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return obj.is_preview
        progress = UserCourseProgress.objects.filter(
            user=user, course=obj.course
        ).first()
        if not progress:
            return obj.is_preview
        # Topic is accessible if previous topics are completed
        previous_topics = obj.course.topics.filter(order__lt=obj.order)
        return all(topic in progress.completed_topics.all() for topic in previous_topics)

class TopicDetailSerializer(TopicListSerializer):
    exercises = ExerciseSerializer(many=True)
    content = serializers.SerializerMethodField()

    class Meta(TopicListSerializer.Meta):
        fields = TopicListSerializer.Meta.fields + ['content', 'exercises']

    def get_content(self, obj):
        user = self.context['request'].user
        if obj.is_preview or (user.is_authenticated and self.get_is_accessible(obj)):
            return obj.content
        return "Please enroll in the course to access this content."

class TopicSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Topic
        fields = ['id', 'title', 'description', 'order', 'is_preview', 'exercises']

class CourseListSerializer(serializers.ModelSerializer):
    topic_count = serializers.IntegerField(source='topics.count', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'icon', 'level', 'status', 'topic_count']

class CourseDetailSerializer(CourseListSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    enrollment_status = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + ['topics', 'enrollment_status', 'progress', 'is_published']

    def get_topics(self, obj):
        topics = obj.topics.all().order_by('order')
        return TopicListSerializer(topics, many=True, context=self.context).data

    def get_enrollment_status(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return 'not_enrolled'
        progress = UserCourseProgress.objects.filter(
            user=user, course=obj
        ).first()
        return progress.status if progress else 'not_enrolled'

    def get_progress(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return 0
        progress = UserCourseProgress.objects.filter(
            user=user, course=obj
        ).first()
        if not progress:
            return 0
        total_topics = obj.topics.count()
        if total_topics == 0:
            return 0
        completed_topics = progress.completed_topics.count()
        return (completed_topics / total_topics) * 100
