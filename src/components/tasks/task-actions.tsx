'use client';
import { MoreHorizontal, Pencil, PlayCircle, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { addDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { type Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TaskActionsProps {
  task: Task;
  onEdit: () => void;
  onTaskUpdate: (task: Partial<Task>) => void;
  onDelete: () => void;
}

export function TaskActions({ task, onEdit, onTaskUpdate, onDelete }: TaskActionsProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete();
    toast({
      title: 'Task Deleted',
      description: `"${task.title}" has been deleted.`,
    });
  };

  const handleMove = (quadrant: 'ui' | 'uni' | 'nui' | 'nuni') => {
    let newProps: Partial<Task> = {};
    const now = new Date();

    switch (quadrant) {
      case 'ui': // Urgent & Important
        newProps = { isHighImpact: true, dueDate: addDays(now, 1) };
        break;
      case 'uni': // Not Urgent & Important
        newProps = { isHighImpact: true, dueDate: addDays(now, 7) };
        break;
      case 'nui': // Urgent & Not Important
        newProps = { isHighImpact: false, dueDate: addDays(now, 1) };
        break;
      case 'nuni': // Not Urgent & Not Important
        newProps = { isHighImpact: false, dueDate: addDays(now, 7) };
        break;
    }
    
    onTaskUpdate(newProps);

    toast({
      title: 'Task Moved',
      description: `"${task.title}" has been moved.`,
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowRight className="mr-2 h-4 w-4" />
            <span>Move to</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={() => handleMove('ui')}>
                Urgent & Important
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleMove('uni')}>
                Not Urgent & Important
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleMove('nui')}>
                Urgent & Not Important
              </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => handleMove('nuni')}>
                Not Urgent & Not Important
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
