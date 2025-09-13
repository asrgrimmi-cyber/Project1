'use client'
import { useState } from 'react';
import { Plus, RotateCcw, Star } from 'lucide-react';

import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/tasks/task-list';
import { buildTaskTree } from '@/lib/helpers';
import { mockTasks as initialMockTasks } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TaskForm } from '@/components/tasks/task-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Task } from '@/lib/types';

export default function DashboardPage() {
  const [mockTasks, setMockTasks] = useState<Task[]>(initialMockTasks);
  const [showHighImpactOnly, setShowHighImpactOnly] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleTaskUpdate = (updatedTask: Task) => {
    setMockTasks(currentTasks =>
      currentTasks.map(t => (t.taskId === updatedTask.taskId ? updatedTask : t))
    );
  };
  
  const handleResetTasks = () => {
    setMockTasks(currentTasks => 
      currentTasks.map(task => ({
        ...task,
        isCompleted: false,
        completionDate: undefined,
      }))
    );
  };

  const filteredTasks = showHighImpactOnly
    ? mockTasks.filter(task => task.isHighImpact)
    : mockTasks;

  const taskTree = buildTaskTree(filteredTasks);

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-amber-400" />
              <Label htmlFor="high-impact-toggle">High-Impact Only</Label>
              <Switch 
                id="high-impact-toggle" 
                checked={showHighImpactOnly}
                onCheckedChange={setShowHighImpactOnly}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleResetTasks}>
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
                <TaskForm tasks={mockTasks} onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TaskList tasks={taskTree} onTaskUpdate={handleTaskUpdate} />
      </main>
    </div>
  );
}
