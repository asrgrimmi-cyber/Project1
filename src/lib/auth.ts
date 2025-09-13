import type { User } from './types';
import { mockUsers } from './data';

// This is a mock implementation of a user session.
// In a real application, this would involve checking a session cookie or token.

// Change this to mockRegularUser to test non-admin access
const currentUser = mockUsers.find(u => u.role === 'Admin');

export function getCurrentUser(): User {
  // In a real app, you would fetch user data based on the session.
  // Fallback to the first user if the admin can't be found
  return currentUser || mockUsers[0];
}
