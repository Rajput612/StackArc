const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const courseService = {
    // Get all courses
    async getCourses() {
        const response = await fetch(`${API_URL}/courses/`);
        return response.json();
    },

    // Get a specific course by slug
    async getCourse(slug) {
        const response = await fetch(`${API_URL}/courses/${slug}/`);
        return response.json();
    },

    // Get topics for a course
    async getCourseTopics(courseSlug) {
        const response = await fetch(`${API_URL}/courses/${courseSlug}/topics/`);
        return response.json();
    },

    // Get a specific topic
    async getTopic(courseSlug, topicSlug) {
        const response = await fetch(`${API_URL}/courses/${courseSlug}/topics/${topicSlug}/`);
        return response.json();
    },

    // Enroll in a course
    async enrollCourse(courseSlug) {
        const response = await fetch(`${API_URL}/courses/${courseSlug}/enroll/`, { method: 'POST' });
        return response.json();
    },

    // Unenroll from a course
    async unenrollCourse(courseSlug) {
        const response = await fetch(`${API_URL}/courses/${courseSlug}/unenroll/`, { method: 'POST' });
        return response.json();
    },

    // Mark a topic as completed
    async markTopicCompleted(courseSlug, topicSlug) {
        const response = await fetch(`${API_URL}/courses/${courseSlug}/topics/${topicSlug}/mark_completed/`, { method: 'POST' });
        return response.json();
    },

    // Mark a topic as incomplete
    async markTopicIncomplete(courseSlug, topicSlug) {
        const response = await fetch(`${API_URL}/courses/${courseSlug}/topics/${topicSlug}/mark_incomplete/`, { method: 'POST' });
        return response.json();
    }
};

export default courseService;
