// Common types used throughout the application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface StudentProfile {
  id: string;
  userId: string;
  degree: string;
  year: string;
  subjects: string[];
  energyPreference: 'morning' | 'afternoon' | 'evening';
  careerInterests: string[];
  financialStressLevel: number; // 1-5
  hobbies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'academic' | 'career' | 'personal';
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category: 'study' | 'health' | 'finance' | 'recovery';
  description: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // ISO date strings
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  linkedGoalId?: string;
  linkedHabitId?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface StressLog {
  id: string;
  userId: string;
  date: string;
  mood: number; // 1-5 scale
  fatigue: number; // 1-5 scale
  studyDuration: number; // hours
  stressFactors: string[];
  notes: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  type: 'study' | 'break' | 'deep-work';
  startTime: string;
  endTime?: string;
  completed: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: 'food' | 'transport' | 'books' | 'entertainment' | 'housing' | 'other';
  description: string;
  date: string;
  createdAt: string;
}

export interface HobbyPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  fileUrl?: string;
  createdAt: string;
}

export interface WeeklyReflection {
  id: string;
  userId: string;
  weekStartDate: string;
  goals: {
    progress: string;
    challenges: string;
    adjustments: string;
  };
  habits: {
    consistency: string;
    insights: string;
    changes: string;
  };
  tasks: {
    completion: string;
    timeManagement: string;
    priorities: string;
  };
  stress: {
    levels: string;
    triggers: string;
    coping: string;
  };
  finance: {
    awareness: string;
    patterns: string;
    adjustments: string;
  };
  hobbies: {
    engagement: string;
    balance: string;
    joy: string;
  };
  overall: {
    highlights: string;
    learnings: string;
    nextWeek: string;
  };
  createdAt: string;
}

export interface CareerTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  completed: boolean;
  category: 'skill-building' | 'exploration' | 'networking' | 'portfolio';
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ProfileForm {
  degree: string;
  year: string;
  subjects: string[];
  energyPreference: 'morning' | 'afternoon' | 'evening';
  careerInterests: string[];
  financialStressLevel: number;
  hobbies: string[];
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AppState {
  user: User | null;
  profile: StudentProfile | null;
  loading: LoadingState;
  error: string | null;
}