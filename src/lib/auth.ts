import type { User } from './types';

// This is a mock implementation of a user session.
// In a real application, this would involve checking a session cookie or token.
const mockAdminUser: User = {
  userId: 'user-1',
  email: 'user@focusflow.com',
  displayName: 'Alex Doe',
  creationDate: new Date('2023-01-15T09:00:00Z'),
  role: 'Admin', // Add role to user type
};

const mockRegularUser: User = {
  userId: 'user-2',
  email: 'jane@example.com',
  displayName: 'Jane Smith',
  creationDate: new Date('2023-01-16T10:00:00Z'),
  role: 'User',
};

// Change this to mockRegularUser to test non-admin access
const currentUser = mockAdminUser;

export function getCurrentUser(): User {
  // In a real app, you would fetch user data based on the session.
  return currentUser;
}
