'use client';

import { useState } from 'react';
import { Star, ChevronRight, GripVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import { TaskWithChildren, Task } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { TaskActions } from './task-actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from './task-form';
import { mockTasks } from '@/lib/data'; // for parent task selection

interface TaskItemProps {
  task: TaskWithChildren;
  level?: number;
  onTaskUpdate?: (task: Task, update: Partial<Task>) => void;
  onTaskDelete?: (task: Task) => void;
}

export function TaskItem({ task, level = 0, onTaskUpdate, onTaskDelete }: TaskItemProps) {
  const [isOpen, setIsOpen] = useState(level < 1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCompletionChange = () => {
    if (onTaskUpdate) {
      onTaskUpdate(task, { 
        isCompleted: !task.isCompleted,
        completionDate: !task.isCompleted ? new Date() : undefined
      });
    }
  };

  const handleTaskPropertyUpdate = (update: Partial<Task>) => {
    if (onTaskUpdate) {
      onTaskUpdate(task, { ...update });
    }
  };

  const handleFullTaskUpdate = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(task, updatedTask);
    }
  }

  const handleTaskDelete = () => {
    if (onTaskDelete) {
      onTaskDelete(task);
    }
  };

  const hasChildren = task.children.length > 0;
  const dueDate = new Date(task.dueDate);
  const isOverdue = !task.isCompleted && dueDate < new Date();

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            'flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-card',
            task.isCompleted && 'bg-muted/50 hover:bg-muted/60'
          )}
          style={{ paddingLeft: `${0.5 + level * 1.5}rem` }}
        >
          <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground/50" />
          <Checkbox
            id={`task-${task.taskId}`}
            checked={task.isCompleted}
            onCheckedChange={handleCompletionChange}
            className="shrink-0"
          />

          <CollapsibleTrigger asChild disabled={!hasChildren} className="flex-grow">
            <div className="flex flex-grow items-center gap-2 cursor-pointer">
              {hasChildren && <ChevronRight className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')} />}
              {!hasChildren && <div className="w-4" />}
              
              <span className={cn('flex-grow text-sm', task.isCompleted && 'text-muted-foreground line-through')}>
                {task.title}
              </span>
            </div>
          </CollapsibleTrigger>
          
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => handleTaskPropertyUpdate({isHighImpact: !task.isHighImpact})} className="group">
              <Star
                className={cn(
                  'h-5 w-5 text-muted-foreground/30 transition-all group-hover:text-amber-400 group-hover:scale-110',
                  task.isHighImpact && 'fill-amber-400 text-amber-400'
                )}
              />
            </button>
            <Badge
              variant={isOverdue ? 'destructive' : 'secondary'}
              className={cn(task.isCompleted && 'bg-transparent text-muted-foreground')}
            >
              {formatDistanceToNow(dueDate, { addSuffix: true })}
            </Badge>

            {task.pomodoroSessions > 0 && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {task.pomodoroSessions} Pomo
              </Badge>
            )}

            <TaskActions 
              task={task} 
              onEdit={() => setIsEditDialogOpen(true)} 
              onTaskUpdate={handleTaskPropertyUpdate}
              onDelete={handleTaskDelete}
            />
          </div>
        </div>

        <CollapsibleContent>
          {task.children.map(child => (
            <TaskItem key={child.taskId} task={child} level={level + 1} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            tasks={mockTasks} 
            task={task} 
            onSuccess={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
