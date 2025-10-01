import type { Course } from './types.js';
import type { StudySyncState } from './types.js';

export class CourseManager {
  private state: StudySyncState;

  constructor(state: StudySyncState) {
    this.state = state;
  }

  createCourse(name: string, subject: string, description: string, color: string = '#4a6fa5'): void {
    if (this.state.currentUser) {
      const newCourse: Course = {
        id: Date.now(),
        name: name,
        subject: subject,
        description: description,
        teacher: this.state.currentUser.name,
        color: color,
        assignments: []
      };
      this.state.courses.push(newCourse);
      this.renderCourses(this.state.courses, 'availableCourses');
      this.showNotification('Course created successfully!', 'success');
    }
  }

  enrollInCourse(courseId: number): void {
    const course = this.state.courses.find(c => c.id === courseId);
    if (course) {
      this.state.enrolledCourses.push(course);
      this.state.courses = this.state.courses.filter(c => c.id !== courseId);
      this.renderCourses(this.state.courses, 'availableCourses');
      this.renderCourses(this.state.enrolledCourses, 'enrolledClasses');
      this.showNotification(`Enrolled in ${course.name} successfully!`, 'success');
    }
  }

  archiveCourse(courseId: number): void {
    const course = this.state.enrolledCourses.find(c => c.id === courseId);
    if (course) {
      this.state.archivedCourses.push(course);
      this.state.enrolledCourses = this.state.enrolledCourses.filter(c => c.id !== courseId);
      this.renderCourses(this.state.enrolledCourses, 'enrolledClasses');
      this.renderCourses(this.state.archivedCourses, 'archivedCourses');
      this.showNotification(`Course ${course.name} archived`, 'info');
    }
  }

  viewCourseAssignments(courseId: number): void {
    const course = [...this.state.courses, ...this.state.enrolledCourses, ...this.state.archivedCourses]
      .find(c => c.id === courseId);
    
    if (course) {
      alert(`Course: ${course.name}\nTeacher: ${course.teacher}\nDescription: ${course.description}\n\nAssignments:\n- Assignment 1: Due Oct 15\n- Assignment 2: Due Oct 22\n- Final Project: Due Nov 5`);
    }
  }

  renderCourses(courses: Course[], containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (courses.length === 0) {
      container.innerHTML = '<p class="no-courses">No courses found</p>';
      return;
    }

    container.innerHTML = courses.map(course => `
      <div class="course-card" style="border-left-color: ${course.color}">
        <div class="course-header">
          <h3 class="course-title">${course.name}</h3>
          <div class="course-color" style="background-color: ${course.color}"></div>
        </div>
        <p class="course-teacher">${course.teacher}</p>
        <p class="course-description">${course.description}</p>
        <div class="course-actions">
          <button class="btn-small btn-view" onclick="app.courseManager.viewCourseAssignments(${course.id})">
            View Assignments
          </button>
          ${containerId === 'availableCourses' ? `
            <button class="btn-small btn-primary" onclick="app.courseManager.enrollInCourse(${course.id})">
              Enroll
            </button>
          ` : ''}
          ${containerId === 'enrolledClasses' ? `
            <button class="btn-small btn-outline" onclick="app.courseManager.archiveCourse(${course.id})">
              Archive
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}