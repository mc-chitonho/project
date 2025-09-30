import type { Todo } from './types.js';
import type { StudySyncState } from './types.js';

export class TodoManager {
  private state: StudySyncState;

  constructor(state: StudySyncState) {
    this.state = state;
  }

  addTodo(text: string, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        priority: priority,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      };
      this.state.todos.push(newTodo);
      this.renderTodos();
      this.showNotification('Task added successfully!', 'success');
    }
  }

  toggleTodo(id: number): void {
    const todo = this.state.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.renderTodos();
    }
  }

  deleteTodo(id: number): void {
    this.state.todos = this.state.todos.filter(t => t.id !== id);
    this.renderTodos();
    this.showNotification('Task deleted', 'info');
  }

  filterTodos(filter: 'all' | 'missing' | 'done'): Todo[] {
    switch (filter) {
      case 'missing':
        return this.state.todos.filter(todo => !todo.completed);
      case 'done':
        return this.state.todos.filter(todo => todo.completed);
      default:
        return this.state.todos;
    }
  }

  renderTodos(todos: Todo[] = this.state.todos): void {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;

    if (todos.length === 0) {
      todoList.innerHTML = '<p class="no-tasks">No tasks found</p>';
      return;
    }

    todoList.innerHTML = todos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
             onclick="app.todoManager.toggleTodo(${todo.id})">
          ${todo.completed ? '✓' : ''}
        </div>
        <div class="todo-text">${todo.text}</div>
        <div class="todo-priority priority-${todo.priority}">
          ${todo.priority}
        </div>
        <div class="todo-actions">
          <button class="btn-icon" onclick="app.todoManager.deleteTodo(${todo.id})">
            <i class="fas fa-trash"></i>
          </button>
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