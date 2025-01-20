"use client"

import {useState, ReactNode, JSX} from 'react'
import { AppSidebar } from '@/components/Sidebar'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { GoalNotifications } from '@/components/organisms/GoalNotifications'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import Header from '@/components/organisms/Header'
import { ProgressBar } from '@/components/ui/progress-bar'

interface LayoutProps {
  children: ReactNode;
  isLoading: boolean;
}

export default function Layout({ children, isLoading }: LayoutProps): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <ProgressBar isLoading={isLoading} />
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex items-center border-b px-4 py-2">
          <Button
            variant="ghost"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Breadcrumbs />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <GoalNotifications />
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
