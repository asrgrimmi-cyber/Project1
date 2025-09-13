'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const userFormSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email(),
  role: z.enum(['Admin', 'User']),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user: User;
  onSuccess: (user: User) => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      displayName: user.displayName,
      email: user.email,
      role: user.role || 'User',
    },
  });

  async function onSubmit(data: UserFormValues) {
    const updatedUser = { ...user, ...data };
    // In a real app, this would be a server action call
    console.log(updatedUser);
    toast({
        title: 'User Updated',
        description: `"${data.displayName}" has been saved.`,
    })
    onSuccess(updatedUser);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Alex Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
