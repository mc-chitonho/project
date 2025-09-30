export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
}

export interface Course {
  id: number;
  name: string;
  subject: string;
  description: string;
  teacher: string;
  color: string;
  assignments: Assignment[];
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  courseId: number;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  createdAt: Date;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  type: 'assignment' | 'class' | 'exam';
  courseId: number;
}

export interface StudySyncState {
  currentUser: User | null;
  courses: Course[];
  enrolledCourses: Course[];
  archivedCourses: Course[];
  todos: Todo[];
  calendarEvents: CalendarEvent[];
  currentMonth: number;
  currentYear: number;
}