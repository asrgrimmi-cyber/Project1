export interface User {
  userId: string;
  email: string;
  displayName: string;
  creationDate: Date;
  role?: 'Admin' | 'User';
  status?: 'Active' | 'Invited' | 'Deactivated';
}

export interface Task {
  taskId: string;
  userId:string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isHighImpact: boolean;
  dueDate: Date;
  parentId: string | null;
  pomodoroSessions: number;
  creationDate: Date;
  completionDate?: Date;
}

export type TaskWithChildren = Task & {
  children: TaskWithChildren[];
};

export interface PomodoroSession {
  sessionId: string;
  userId: string;
  taskId: string;
  sessionType: 'Work' | 'Short Break' | 'Long Break';
  duration: number; // in minutes
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
}
