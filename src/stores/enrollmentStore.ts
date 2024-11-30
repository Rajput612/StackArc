// Simple enrollment store using localStorage
export class EnrollmentStore {
  private static STORAGE_KEY = 'stackarc_enrollments';

  static getEnrollments(): string[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static isEnrolled(courseId: string): boolean {
    const enrollments = this.getEnrollments();
    return enrollments.includes(courseId);
  }

  static enroll(courseId: string): void {
    const enrollments = this.getEnrollments();
    if (!enrollments.includes(courseId)) {
      enrollments.push(courseId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(enrollments));
    }
  }

  static unenroll(courseId: string): void {
    const enrollments = this.getEnrollments();
    const filtered = enrollments.filter(id => id !== courseId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}
