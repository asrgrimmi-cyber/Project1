'use client';
import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserForm } from '@/components/admin/user-form';
import { type User } from '@/lib/types';
import { mockUsers as initialMockUsers } from '@/lib/data';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(initialMockUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };
  
  const handleDeactivate = (userId: string) => {
    setUsers(currentUsers =>
        currentUsers.map(u => u.userId === userId ? { ...u, status: 'Deactivated' } : u)
    );
  };

  const handleSuccess = (updatedUser: User) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u.userId === updatedUser.userId ? updatedUser : u))
    );
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Admin Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage users in your organization.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.userId}>
                                <TableCell className="font-medium">{user.displayName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className={user.status === 'Active' ? 'bg-green-500' : ''}>
                                        {user.status || 'Invited'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => handleEdit(user)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleDeactivate(user.userId)}>Deactivate</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserForm user={selectedUser} onSuccess={handleSuccess} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
