import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from '@/components/LoginForm'
import { SignUpForm } from '@/components/SignUpForm'
import { UnsplashImage } from '@/components/UnsplashImage'
import Layout from '@/components/templates/Layout'

export const metadata: Metadata = {
  title: 'TheDevClub - Login or Sign Up',
  description: 'Login or create an account to start tracking your daily progress. Use your email, GitHub, or Google account.',
}

export default function AuthPage() {
  return (
    <Layout isLoading={false}>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex-1">
          <Tabs defaultValue="login" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="h-[calc(100%-40px)]">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="h-[calc(100%-40px)]">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex-1">
          <UnsplashImage />
        </div>
      </div>
    </Layout>
  )
}