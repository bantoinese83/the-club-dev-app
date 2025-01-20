'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart2,
  Target,
  Search,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { JSX } from 'react';

export function AppSidebar(): JSX.Element {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-2">
        <Link href="/" className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6" />
          <span className="text-lg font-bold">TheDevClub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <nav>
          <ul>
            <li className={pathname === '/dashboard' ? 'active' : ''}>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={pathname === '/goals' ? 'active' : ''}>
              <Link href="/goals" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Goals</span>
              </Link>
            </li>
            <li className={pathname === '/search' ? 'active' : ''}>
              <Link href="/search" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search Entries</span>
              </Link>
            </li>
            <li className={pathname === '/profile' ? 'active' : ''}>
              <Link href="/profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </li>
            <li className={pathname === '/settings' ? 'active' : ''}>
              <Link href="/settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
