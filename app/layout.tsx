import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import ErrorBoundary from '@/components/ErrorBoundary'
import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Provider } from 'react-redux'
import {store} from '@/lib/store'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TheDevClub',
  description: 'Track your daily progress, integrate with GitHub, and boost your productivity with AI-powered insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <SidebarProvider>
              <Provider store={store}>
                {children}
              </Provider>
            </SidebarProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}