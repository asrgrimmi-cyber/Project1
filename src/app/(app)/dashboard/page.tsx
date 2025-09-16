'use client';
import { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { addDays, isBefore } from 'date-fns';

import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/tasks/task-list';
import { buildTaskTree } from '@/lib/helpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TaskForm } from '@/components/tasks/task-form';
import { Task, TaskWithChildren } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/context/task-context';

const Quadrant = ({ title, tasks, onTaskUpdate, onTaskDelete }: { title: string, tasks: TaskWithChildren[], onTaskUpdate: (task: Task, update: Partial<Task>) => void, onTaskDelete: (task: Task) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <TaskList tasks={tasks} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  const { tasks, updateTask, deleteTask, resetTasks, addTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSuccess = (newTask: Omit<Task, 'taskId' | 'creationDate' | 'pomodoroSessions' | 'isCompleted'>) => {
    addTask(newTask);
    setIsFormOpen(false);
  }

  const visibleTasks = tasks.filter(task => !task.isCompleted);

  const urgentThreshold = addDays(new Date(), 3);

  const isUrgent = (task: Task) => isBefore(new Date(task.dueDate), urgentThreshold);

  const urgentImportantTasks = buildTaskTree(visibleTasks.filter(t => isUrgent(t) && t.isHighImpact));
  const notUrgentImportantTasks = buildTaskTree(visibleTasks.filter(t => !isUrgent(t) && t.isHighImpact));
  const urgentNotImportantTasks = buildTaskTree(visibleTasks.filter(t => isUrgent(t) && !t.isHighImpact));
  const notUrgentNotImportantTasks = buildTaskTree(visibleTasks.filter(t => !isUrgent(t) && !t.isHighImpact));

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Future controls can go here */}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetTasks}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Tasks
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Add a new task</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new task. You can assign it to a parent task to create a hierarchy.
                  </DialogDescription>
                </DialogHeader>
                <TaskForm tasks={tasks} onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Quadrant title="Urgent & Important" tasks={urgentImportantTasks} onTaskUpdate={updateTask} onTaskDelete={deleteTask} />
          <Quadrant title="Not Urgent & Important" tasks={notUrgentImportantTasks} onTaskUpdate={updateTask} onTaskDelete={deleteTask} />
          <Quadrant title="Urgent & Not Important" tasks={urgentNotImportantTasks} onTaskUpdate={updateTask} onTaskDelete={deleteTask} />
          <Quadrant title="Not Urgent & Not Important" tasks={notUrgentNotImportantTasks} onTaskUpdate={updateTask} onTaskDelete={deleteTask} />
        </div>
      </main>
    </div>
  );
}
