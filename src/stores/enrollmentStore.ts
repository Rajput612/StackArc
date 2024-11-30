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
  private storageKey = 'course_enrollments';

  constructor() {
    this.enrollments = new Map();
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      this.enrollments = new Map(Object.entries(data));
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    
    const data = Object.fromEntries(this.enrollments);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  enroll(courseId: string, userId: string) {
    const enrollment: Enrollment = {
      courseId,
      userId,
      progress: {
        completedConcepts: [],
        lastAccessed: new Date().toISOString()
      },
      status: 'active'
    };

    this.enrollments.set(`${courseId}_${userId}`, enrollment);
    this.saveToStorage();
    window.dispatchEvent(new CustomEvent('enrollmentChanged'));
  }

  isEnrolled(courseId: string, userId: string = 'user123'): boolean {
    return this.enrollments.has(`${courseId}_${userId}`);
  }

  getEnrollment(courseId: string, userId: string = 'user123'): Enrollment | null {
    return this.enrollments.get(`${courseId}_${userId}`) || null;
  }

  updateProgress(courseId: string, userId: string, conceptId: string) {
    const enrollment = this.getEnrollment(courseId, userId);
    if (!enrollment) return;

    if (!enrollment.progress.completedConcepts.includes(conceptId)) {
      enrollment.progress.completedConcepts.push(conceptId);
    }
    enrollment.progress.lastAccessed = new Date().toISOString();
    
    this.enrollments.set(`${courseId}_${userId}`, enrollment);
    this.saveToStorage();
    window.dispatchEvent(new CustomEvent('enrollmentChanged'));
  }
}

export const EnrollmentStore = new EnrollmentStoreClass();
class EnrollmentStoreClass {
  private enrolledCourses: Set<string>;

  constructor() {
    // Load enrolled courses from localStorage if available
    const stored = localStorage.getItem('enrolledCourses');
    this.enrolledCourses = new Set(stored ? JSON.parse(stored) : []);
  }

  enroll(courseId: string): void {
    this.enrolledCourses.add(courseId);
    this.saveToStorage();
  }

  unenroll(courseId: string): void {
    this.enrolledCourses.delete(courseId);
    this.saveToStorage();
  }

  isEnrolled(courseId: string): boolean {
    return this.enrolledCourses.has(courseId);
  }

  private saveToStorage(): void {
    localStorage.setItem('enrolledCourses', JSON.stringify(Array.from(this.enrolledCourses)));
  }
}

// Create a singleton instance
export const EnrollmentStore = new EnrollmentStoreClass();
