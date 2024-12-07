from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Course, Topic, Exercise, UserCourseProgress
from .serializers import (
    CourseListSerializer, CourseDetailSerializer,
    TopicListSerializer, TopicDetailSerializer,
    ExerciseSerializer, ExerciseDetailSerializer
)
from .permissions import IsEnrolledOrPreview

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.prefetch_related('topics', 'topics__exercises')#.filter(is_published=True)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'difficulty', 'duration']
    ordering = ['title']
    lookup_field = 'slug'
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, slug=None):
        course = self.get_object()
        progress, created = UserCourseProgress.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={'status': 'enrolled'}
        )
        if not created:
            return Response(
                {'detail': 'Already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({'detail': 'Successfully enrolled in the course.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unenroll(self, request, slug=None):
        course = self.get_object()
        deleted_count, _ = UserCourseProgress.objects.filter(
            user=request.user,
            course=course
        ).delete()
        if deleted_count == 0:
            return Response(
                {'detail': 'Not enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({'detail': 'Successfully unenrolled from the course.'})

class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsEnrolledOrPreview]
    lookup_field = 'slug'

    def get_queryset(self):
        return Topic.objects.filter(
            course__slug=self.kwargs['course_slug'],
            course__is_published=True
        ).order_by('order')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TopicDetailSerializer
        return TopicListSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def complete(self, request, course_slug=None, slug=None):
        topic = self.get_object()
        progress = get_object_or_404(
            UserCourseProgress,
            user=request.user,
            course__slug=course_slug
        )
        progress.completed_topics.add(topic)
        progress.last_accessed = timezone.now()
        
        # Check if all topics are completed
        all_topics = topic.course.topics.count()
        completed_topics = progress.completed_topics.count()
        if all_topics == completed_topics:
            progress.status = 'completed'
        else:
            progress.status = 'in_progress'
        
        progress.save()
        return Response({'detail': 'Topic marked as completed.'})

class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsEnrolledOrPreview]
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        return Exercise.objects.filter(
            topic__slug=self.kwargs['topic_slug'],
            topic__course__slug=self.kwargs['course_slug'],
            topic__course__is_published=True
        ).order_by('order')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ExerciseDetailSerializer
        return ExerciseSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def complete(self, request, course_slug=None, topic_slug=None, pk=None):
        exercise = self.get_object()
        progress = get_object_or_404(
            UserCourseProgress,
            user=request.user,
            course__slug=course_slug
        )
        progress.completed_exercises.add(exercise)
        progress.last_accessed = timezone.now()
        progress.save()
        return Response({'detail': 'Exercise marked as completed.'})