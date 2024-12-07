import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const courseService = {
    // Get all courses
    async getCourses() {
        const response = await axios.get(`${API_URL}/courses/`);
        return response.data;
    },

    // Get a specific course by slug
    async getCourse(slug) {
        const response = await axios.get(`${API_URL}/courses/${slug}/`);
        return response.data;
    },

    // Get topics for a course
    async getCourseTopics(courseSlug) {
        const response = await axios.get(`${API_URL}/courses/${courseSlug}/topics/`);
        return response.data;
    },

    // Get a specific topic
    async getTopic(courseSlug, topicSlug) {
        const response = await axios.get(`${API_URL}/courses/${courseSlug}/topics/${topicSlug}/`);
        return response.data;
    },

    // Enroll in a course
    async enrollCourse(courseSlug) {
        const response = await axios.post(`${API_URL}/courses/${courseSlug}/enroll/`);
        return response.data;
    },

    // Unenroll from a course
    async unenrollCourse(courseSlug) {
        const response = await axios.post(`${API_URL}/courses/${courseSlug}/unenroll/`);
        return response.data;
    },

    // Mark a topic as completed
    async markTopicCompleted(courseSlug, topicSlug) {
        const response = await axios.post(`${API_URL}/courses/${courseSlug}/topics/${topicSlug}/mark_completed/`);
        return response.data;
    },

    // Mark a topic as incomplete
    async markTopicIncomplete(courseSlug, topicSlug) {
        const response = await axios.post(`${API_URL}/courses/${courseSlug}/topics/${topicSlug}/mark_incomplete/`);
        return response.data;
    }
};

export default courseService;
