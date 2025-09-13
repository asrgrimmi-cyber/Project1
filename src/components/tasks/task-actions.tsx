'use client';
import { MoreHorizontal, Pencil, PlayCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TaskActionsProps {
  task: Task;
  onEdit: () => void;
}

export function TaskActions({ task, onEdit }: TaskActionsProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    // In a real app, this would call a server action
    toast({
      title: 'Task Deleted',
      description: `"${task.title}" has been deleted.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <Link href={`/timer/${task.taskId}`} passHref>
          <DropdownMenuItem>
              <PlayCircle className="mr-2 h-4 w-4" />
              <span>Start Pomodoro</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
