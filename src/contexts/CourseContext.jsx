import React, { createContext, useContext, useState, useEffect } from 'react';
import courseService from '../services/courseService';
import { useAuth } from './AuthContext';

const CourseContext = createContext();

export function CourseProvider({ children }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await courseService.getCourses();
            setCourses(data);
            setError(null);
        } catch (err) {
            setError('Failed to load courses');
            console.error('Error loading courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const enrollInCourse = async (courseSlug) => {
        if (!isAuthenticated) {
            throw new Error('You must be logged in to enroll in a course');
        }
        
        try {
            await courseService.enrollCourse(courseSlug);
            await loadCourses(); // Reload courses to update enrollment status
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Failed to enroll in course');
        }
    };

    const unenrollFromCourse = async (courseSlug) => {
        if (!isAuthenticated) {
            throw new Error('You must be logged in to unenroll from a course');
        }
        
        try {
            await courseService.unenrollCourse(courseSlug);
            await loadCourses(); // Reload courses to update enrollment status
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Failed to unenroll from course');
        }
    };

    const markTopicCompleted = async (courseSlug, topicSlug) => {
        if (!isAuthenticated) {
            throw new Error('You must be logged in to mark topics as completed');
        }
        
        try {
            await courseService.markTopicCompleted(courseSlug, topicSlug);
            await loadCourses(); // Reload to update progress
        } catch (err) {
            throw new Error('Failed to mark topic as completed');
        }
    };

    const markTopicIncomplete = async (courseSlug, topicSlug) => {
        if (!isAuthenticated) {
            throw new Error('You must be logged in to mark topics as incomplete');
        }
        
        try {
            await courseService.markTopicIncomplete(courseSlug, topicSlug);
            await loadCourses(); // Reload to update progress
        } catch (err) {
            throw new Error('Failed to mark topic as incomplete');
        }
    };

    return (
        <CourseContext.Provider
            value={{
                courses,
                loading,
                error,
                enrollInCourse,
                unenrollFromCourse,
                markTopicCompleted,
                markTopicIncomplete,
                refreshCourses: loadCourses
            }}
        >
            {children}
        </CourseContext.Provider>
    );
}

export function useCourses() {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourses must be used within a CourseProvider');
    }
    return context;
}
