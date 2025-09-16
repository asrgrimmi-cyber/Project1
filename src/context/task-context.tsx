'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/lib/types';
import { mockTasks as initialMockTasks } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'taskId' | 'creationDate' | 'pomodoroSessions' | 'isCompleted' | 'userId'>) => void;
  updateTask: (taskToUpdate: Task, updatedProperties: Partial<Task>) => void;
  deleteTask: (taskToDelete: Task) => void;
  resetTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks);
  const { toast } = useToast();

  const addTask = (taskData: Omit<Task, 'taskId' | 'creationDate' | 'pomodoroSessions' | 'isCompleted' | 'userId'>) => {
    const newTask: Task = {
      ...taskData,
      taskId: `task-${Date.now()}`,
      userId: 'user-1', // Mock user ID
      isCompleted: false,
      pomodoroSessions: 0,
      creationDate: new Date(),
    };
    setTasks(currentTasks => [...currentTasks, newTask]);
  };

  const updateTask = (taskToUpdate: Task, updatedProperties: Partial<Task>) => {
    setTasks(currentTasks =>
      currentTasks.map(t => (t.taskId === taskToUpdate.taskId ? { ...t, ...updatedProperties } : t))
    );
  };

  const deleteTask = (taskToDelete: Task) => {
    setTasks(currentTasks =>
      currentTasks.filter(t => t.taskId !== taskToDelete.taskId)
    );
    toast({
        title: 'Task Deleted',
        description: `"${taskToDelete.title}" has been deleted.`,
    });
  };

  const resetTasks = () => {
    setTasks(currentTasks =>
      currentTasks.map(task => ({
        ...task,
        isCompleted: false,
        completionDate: undefined,
      }))
    );
    toast({
        title: 'Tasks Reset',
        description: 'All tasks have been reset to incomplete.',
    });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, resetTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
