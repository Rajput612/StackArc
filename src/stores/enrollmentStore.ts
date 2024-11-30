interface Enrollment {
  courseId: string;
  userId: string;
  progress: {
    completedConcepts: string[];
    lastAccessed: string;
  };
  status: 'active' | 'completed' | 'paused';
}

class EnrollmentStoreClass {
  private enrollments: Map<string, Enrollment>;
  private enrolledCourses: Set<string>;
  private storageKey = 'course_enrollments';

  constructor() {
    this.enrollments = new Map();
    this.enrolledCourses = new Set();

    this.loadEnrollmentsFromStorage();
    this.loadCoursesFromStorage();
  }

  // Load enrollment data from localStorage
  private loadEnrollmentsFromStorage() {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      this.enrollments = new Map(Object.entries(data));
    }
  }

  // Load enrolled courses from localStorage
  private loadCoursesFromStorage() {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('enrolledCourses');
    this.enrolledCourses = new Set(stored ? JSON.parse(stored) : []);
  }

  // Save enrollment data to localStorage
  private saveEnrollmentsToStorage() {
    if (typeof window === 'undefined') return;

    const data = Object.fromEntries(this.enrollments);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Save enrolled courses to localStorage
  private saveCoursesToStorage() {
    if (typeof window === 'undefined') return;

    localStorage.setItem('enrolledCourses', JSON.stringify(Array.from(this.enrolledCourses)));
  }

  // Enroll a user in a course
  enroll(courseId: string, userId: string) {
    const enrollment: Enrollment = {
      courseId,
      userId,
      progress: {
        completedConcepts: [],
        lastAccessed: new Date().toISOString(),
      },
      status: 'active',
    };

    this.enrollments.set(`${courseId}_${userId}`, enrollment);
    this.enrolledCourses.add(courseId);

    this.saveEnrollmentsToStorage();
    this.saveCoursesToStorage();
    window.dispatchEvent(new CustomEvent('enrollmentChanged'));
  }

  // Unenroll from a course
  unenroll(courseId: string) {
    this.enrolledCourses.delete(courseId);
    this.saveCoursesToStorage();
  }

  // Check if a user is enrolled in a course
  isEnrolled(courseId: string, userId: string = 'user123'): boolean {
    return this.enrollments.has(`${courseId}_${userId}`) || this.enrolledCourses.has(courseId);
  }

  // Get enrollment details
  getEnrollment(courseId: string, userId: string = 'user123'): Enrollment | null {
    return this.enrollments.get(`${courseId}_${userId}`) || null;
  }

  // Update progress for a course
  updateProgress(courseId: string, userId: string, conceptId: string) {
    const enrollment = this.getEnrollment(courseId, userId);
    if (!enrollment) return;

    if (!enrollment.progress.completedConcepts.includes(conceptId)) {
      enrollment.progress.completedConcepts.push(conceptId);
    }
    enrollment.progress.lastAccessed = new Date().toISOString();

    this.enrollments.set(`${courseId}_${userId}`, enrollment);
    this.saveEnrollmentsToStorage();
    window.dispatchEvent(new CustomEvent('enrollmentChanged'));
  }
}

// Export a singleton instance
export const EnrollmentStore = new EnrollmentStoreClass();
