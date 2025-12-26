// API service for communicating with backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7071/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add authentication header if available
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    // TODO: Implement proper token retrieval from MSAL
    // For now, return mock token for development
    return 'mock-token';
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(profile: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Goals endpoints
  async getGoals() {
    return this.request('/goals');
  }

  async createGoal(goal: any) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateGoal(goalId: string, goal: any) {
    return this.request(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  }

  async deleteGoal(goalId: string) {
    return this.request(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  }

  // Habits endpoints
  async getHabits() {
    return this.request('/habits');
  }

  async createHabit(habit: any) {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  }

  async updateHabit(habitId: string, habit: any) {
    return this.request(`/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify(habit),
    });
  }

  async deleteHabit(habitId: string) {
    return this.request(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  }

  // Tasks endpoints
  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(task: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(taskId: string, task: any) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Stress logs endpoints
  async getStressLogs() {
    return this.request('/stress');
  }

  async createStressLog(log: any) {
    return this.request('/stress', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  }

  // Focus sessions endpoints
  async getFocusSessions() {
    return this.request('/focus');
  }

  async createFocusSession(session: any) {
    return this.request('/focus', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  async updateFocusSession(sessionId: string, session: any) {
    return this.request(`/focus/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(session),
    });
  }

  // Expenses endpoints
  async getExpenses() {
    return this.request('/expenses');
  }

  async createExpense(expense: any) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(expenseId: string) {
    return this.request(`/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  }

  // Hobby posts endpoints
  async getHobbyPosts() {
    return this.request('/hobbies');
  }

  async createHobbyPost(post: any) {
    return this.request('/hobbies', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  // Reflections endpoints
  async getReflections() {
    return this.request('/reflections');
  }

  async createReflection(reflection: any) {
    return this.request('/reflections', {
      method: 'POST',
      body: JSON.stringify(reflection),
    });
  }

  // Career tasks endpoints
  async getCareerTasks() {
    return this.request('/career');
  }

  async createCareerTask(task: any) {
    return this.request('/career', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateCareerTask(taskId: string, task: any) {
    return this.request(`/career/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  // AI endpoints
  async aiChat(message: string, context?: any) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async generateRoutine() {
    return this.request('/ai/routine', {
      method: 'POST',
    });
  }

  async getStudyGuidance(subject: string, topic: string, level?: string) {
    return this.request('/ai/study', {
      method: 'POST',
      body: JSON.stringify({ subject, topic, level }),
    });
  }

  async generateCareerTasks() {
    return this.request('/ai/career', {
      method: 'POST',
    });
  }

  // File upload endpoint
  async uploadFile(file: File, type: 'hobby' | 'profile'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return await response.json();
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();