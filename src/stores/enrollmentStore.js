export class EnrollmentStore {
  constructor() {
    this.apiBaseUrl = 'http://localhost:8000/api';
  }

  async getEnrollmentStatus(courseId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/courses/${courseId}/`);
      const data = await response.json();
      return data.enrollment_status;
    } catch (error) {
      console.error('Error fetching enrollment status:', error);
      return null;
    }
  }

  async enrollInCourse(courseId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/courses/${courseId}/enroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }

      const data = await response.json();
      // Dispatch an event to notify UI of enrollment change
      window.dispatchEvent(new CustomEvent('enrollmentChanged', {
        detail: { courseId, status: 'enrolled' }
      }));
      
      return data;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }

  async unenrollFromCourse(courseId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/courses/${courseId}/unenroll/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unenroll from course');
      }

      const data = await response.json();
      // Dispatch an event to notify UI of enrollment change
      window.dispatchEvent(new CustomEvent('enrollmentChanged', {
        detail: { courseId, status: 'unenrolled' }
      }));

      return data;
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      throw error;
    }
  }

  async getCourseProgress(courseId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/courses/${courseId}/`);
      const data = await response.json();
      return data.progress;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      return null;
    }
  }
}
