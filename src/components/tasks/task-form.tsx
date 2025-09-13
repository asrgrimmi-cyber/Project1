'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { type Task } from '@/lib/types';
import { suggestTaskContent } from '@/ai/flows/context-aware-task-suggestion';
import { useToast } from '@/hooks/use-toast';

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  parentId: z.string().nullable(),
  isHighImpact: z.boolean(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  tasks: Task[];
  task?: Task | null;
  onSuccess: () => void;
}

export function TaskForm({ tasks, task, onSuccess }: TaskFormProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  
  const parentTasks = tasks.filter(t => !t.parentId && t.taskId !== task?.taskId);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
      parentId: task?.parentId || null,
      isHighImpact: task?.isHighImpact || false,
    },
  });

  async function onSubmit(data: TaskFormValues) {
    // Here you would typically call a server action to save the task
    console.log(data);
    toast({
        title: `Task ${task ? 'updated' : 'created'}`,
        description: `"${data.title}" has been saved.`,
    })
    onSuccess();
  }

  const handleSuggestion = async (type: 'title' | 'description') => {
    setIsSuggesting(true);
    try {
      const existingTasks = tasks.map(t => t.title).join(', ');
      const category = form.getValues('parentId') 
        ? tasks.find(t => t.taskId === form.getValues('parentId'))?.title ?? 'General' 
        : 'General';

      const result = await suggestTaskContent({
        existingTasks,
        category,
        type,
      });

      if (result.suggestion) {
        form.setValue(type, result.suggestion);
      }
    } catch (error) {
      console.error('Failed to get suggestion:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not generate a suggestion at this time.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g. Design a new logo" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleSuggestion('title')} disabled={isSuggesting}>
                        <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Textarea
                        placeholder="Add more details about your task..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleSuggestion('description')} disabled={isSuggesting}>
                        <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Task</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Main Task)</SelectItem>
                      {parentTasks.map(parent => (
                        <SelectItem key={parent.taskId} value={parent.taskId}>
                          {parent.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
            control={form.control}
            name="isHighImpact"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">High-Impact Task</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSuggesting}>{task ? 'Update Task' : 'Create Task'}</Button>
      </form>
    </Form>
  );
}
