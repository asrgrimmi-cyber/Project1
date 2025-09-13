'use client'
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  if (user.role !== 'Admin') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
