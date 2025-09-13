'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { Button } from './ui/button';
import { getCurrentUser } from '@/lib/auth';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/results', label: 'Results', icon: BarChart2, adminOnly: false },
  { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = getCurrentUser();
  const isAdmin = user.role === 'Admin';

  const availableMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {availableMenuItems.map(item => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/login" legacyBehavior passHref>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
