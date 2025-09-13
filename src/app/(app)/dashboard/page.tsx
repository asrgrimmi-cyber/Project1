'use client'
import { useState } from 'react';
import { Plus, Star } from 'lucide-react';

import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/tasks/task-list';
import { buildTaskTree } from '@/lib/helpers';
import { mockTasks } from '@/lib/data';
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

export default function DashboardPage() {
  const [showHighImpactOnly, setShowHighImpactOnly] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        <TaskList tasks={taskTree} />
      </main>
    </div>
  );
}
