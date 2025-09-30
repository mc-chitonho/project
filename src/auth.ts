import type { User } from './types.js';
import type { StudySyncState } from './types.js';

export class AuthManager {
  private state: StudySyncState;

  constructor(state: StudySyncState) {
    this.state = state;
  }

  login(email: string, password: string): boolean {
    // Simulate authentication
    if (email && password) {
      this.state.currentUser = {
        id: 1,
        name: "John Doe",
        email: email,
        role: "student",
        avatar: "JD"
      };
      this.showNotification('Successfully logged in!', 'success');
      return true;
    }
    this.showNotification('Please fill in all fields', 'error');
    return false;
  }

  signup(name: string, email: string, password: string, role: 'student' | 'teacher'): boolean {
    if (name && email && password && role) {
      this.state.currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        avatar: name.split(' ').map(n => n[0]).join('')
      };
      this.showNotification('Account created successfully!', 'success');
      return true;
    }
    this.showNotification('Please fill in all fields', 'error');
    return false;
  }

  logout(): void {
    this.state.currentUser = null;
    this.showNotification('Logged out successfully', 'info');
  }

  getCurrentUser(): User | null {
    return this.state.currentUser;
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