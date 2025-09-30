import type { StudySyncState } from './types.js';
import { AuthManager } from './auth.js';
import { TodoManager } from './todo';
import { CourseManager } from './courses.js';

class StudySyncApp {
  public state: StudySyncState;
  public authManager: AuthManager;
  public todoManager: TodoManager;
  public courseManager: CourseManager;

  constructor() {
    this.state = {
      currentUser: null,
      courses: [],
      enrolledCourses: [],
      archivedCourses: [],
      todos: [],
      calendarEvents: [],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear()
    };

    this.authManager = new AuthManager(this.state);
    this.todoManager = new TodoManager(this.state);
    this.courseManager = new CourseManager(this.state);

    this.init();
  }

  private init(): void {
    this.loadSampleData();
    this.setupEventListeners();
    this.updateUI();
    console.log('StudySync App initialized!');
  }

  private loadSampleData(): void {
    // Sample courses
    this.state.courses = [
      {
        id: 1,
        name: "Mathematics 101",
        subject: "Mathematics",
        description: "Basic algebra and calculus fundamentals",
        teacher: "Dr. Sarah Johnson",
        color: "#3498db",
        assignments: []
      },
      {
        id: 2,
        name: "Physics Advanced",
        subject: "Physics",
        description: "Advanced physics concepts and applications",
        teacher: "Prof. Michael Chen",
        color: "#e67e22",
        assignments: []
      }
    ];

    this.state.enrolledCourses = [
      {
        id: 3,
        name: "Biology Fundamentals",
        subject: "Biology",
        description: "Introduction to biological systems",
        teacher: "Dr. Emily Wilson",
        color: "#2ecc71",
        assignments: []
      }
    ];

    // Sample todos
    this.state.todos = [
      {
        id: 1,
        text: "Complete Math assignment",
        completed: false,
        priority: "high",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: 2,
        text: "Read Biology chapter 5",
        completed: true,
        priority: "medium",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      }
    ];
  }

  private setupEventListeners(): void {
    // Auth events
    document.getElementById('showSignup')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showSignupForm();
    });

    document.getElementById('showLogin')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoginForm();
    });

    document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    document.getElementById('signupFormElement')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignup();
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      this.handleLogout();
    });

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = (e.target as HTMLElement).getAttribute('data-section');
        if (section) this.showSection(section);
      });
    });

    // Todo events
    document.getElementById('addTodoBtn')?.addEventListener('click', () => {
      this.addTodo();
    });

    document.getElementById('newTodo')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addTodo();
      }
    });

    // Course events
    document.getElementById('createCourseBtn')?.addEventListener('click', () => {
      this.showCreateCourseModal();
    });

    document.getElementById('joinClassBtn')?.addEventListener('click', () => {
      this.showJoinClassModal();
    });
  }

  private showSignupForm(): void {
    document.getElementById('loginForm')?.classList.remove('active');
    document.getElementById('signupForm')?.classList.add('active');
  }

  private showLoginForm(): void {
    document.getElementById('signupForm')?.classList.remove('active');
    document.getElementById('loginForm')?.classList.add('active');
  }

  private handleLogin(): void {
    const email = (document.getElementById('loginEmail') as HTMLInputElement)?.value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement)?.value;
    
    if (email && password) {
      this.authManager.login(email, password);
      this.updateUI();
    }
  }

  private handleSignup(): void {
    const name = (document.getElementById('signupName') as HTMLInputElement)?.value;
    const email = (document.getElementById('signupEmail') as HTMLInputElement)?.value;
    const password = (document.getElementById('signupPassword') as HTMLInputElement)?.value;
    const role = (document.getElementById('userRole') as HTMLSelectElement)?.value as 'student' | 'teacher';
    
    if (name && email && password && role) {
      this.authManager.signup(name, email, password, role);
      this.updateUI();
    }
  }

  private handleLogout(): void {
    this.authManager.logout();
    this.updateUI();
  }

  private addTodo(): void {
    const input = document.getElementById('newTodo') as HTMLInputElement;
    if (input) {
      this.todoManager.addTodo(input.value);
      input.value = '';
    }
  }

  private showCreateCourseModal(): void {
    const courseName = prompt('Enter course name:');
    if (courseName) {
      this.courseManager.createCourse(courseName, 'General', 'New course description');
    }
  }

  private showJoinClassModal(): void {
    const classCode = prompt('Enter class code:');
    if (classCode) {
      // Simulate joining a class
      this.courseManager.createCourse(`Class ${classCode}`, 'General', 'Joined via class code', '#9b59b6');
    }
  }

  private showSection(sectionId: string): void {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
      if (section.id === sectionId) {
        section.classList.add('active');
      }
    });

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = this.getSectionTitle(sectionId);
    }

    // Load section data
    this.loadSectionData(sectionId);
  }

  private getSectionTitle(sectionId: string): string {
    const titles: { [key: string]: string } = {
      'home': 'Home',
      'calendar': 'Calendar',
      'enrolled': 'Enrolled Classes',
      'todo': 'To-Do List',
      'courses': 'Available Courses',
      'archived': 'Archived Courses',
      'settings': 'Account Settings'
    };
    return titles[sectionId] || 'StudySync';
  }

  private loadSectionData(sectionId: string): void {
    switch (sectionId) {
      case 'home':
        this.courseManager.renderCourses(this.state.enrolledCourses, 'coursesContainer');
        break;
      case 'todo':
        this.todoManager.renderTodos();
        break;
      case 'courses':
        this.courseManager.renderCourses(this.state.courses, 'availableCourses');
        break;
      case 'enrolled':
        this.courseManager.renderCourses(this.state.enrolledCourses, 'enrolledClasses');
        break;
    }
  }

  private updateUI(): void {
    const user = this.authManager.getCurrentUser();
    
    if (user) {
      // Show app, hide auth
      document.getElementById('authSection')?.classList.remove('active');
      document.getElementById('appSection')?.classList.add('active');

      // Update user info
      const updateElement = (id: string, text: string) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
      };

      updateElement('userName', user.name);
      updateElement('userRoleDisplay', user.role);
      updateElement('userAvatar', user.avatar);
      updateElement('userAvatarSm', user.avatar);
      updateElement('welcomeName', user.name.split(' ')[0]);

      // Load initial data
      this.loadSectionData('home');
    } else {
      // Show auth, hide app
      document.getElementById('authSection')?.classList.add('active');
      document.getElementById('appSection')?.classList.remove('active');
    }
  }
}

// Initialize the app
const app = new StudySyncApp();

// Make app globally available for HTML onclick handlers
declare global {
  interface Window {
    app: StudySyncApp;
  }
}
window.app = app;