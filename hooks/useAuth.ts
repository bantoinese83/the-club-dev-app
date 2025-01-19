import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, PartialUser } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const session = await res.json()
        if (session.user) {
          setUser(session.user)
        }
      }
    } catch (error) {
      console.error('Failed to check authentication status', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: PartialUser; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        router.push('/dashboard')
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login failed', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; user?: PartialUser; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        router.push('/dashboard')
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Signup failed' }
      }
    } catch (error) {
      console.error('Signup failed', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const loginWithProvider = async (provider: 'github' | 'google') => {
    try {
      const res = await fetch(`/api/auth/${provider}`)
      if (res.ok) {
        const { url } = await res.json()
        window.location.href = url
      } else {
        throw new Error(`Failed to initiate ${provider} login`)
      }
    } catch (error) {
      console.error(`${provider} login failed`, error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  return { user, loading, login, signup, logout, loginWithProvider }
}

