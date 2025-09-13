'use client';
import { Task, TaskWithChildren } from '@/lib/types';
import { TaskItem } from './task-item';

interface TaskListProps {
  tasks: TaskWithChildren[];
  onTaskUpdate?: (task: Task) => void;
}

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card/50 p-12 text-center">
        <h3 className="font-headline text-xl font-semibold tracking-tight">You have no tasks here.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Move tasks or create a new one to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tasks.map(task => (
        <TaskItem key={task.taskId} task={task} onTaskUpdate={onTaskUpdate} />
      ))}
    </div>
  );
}
