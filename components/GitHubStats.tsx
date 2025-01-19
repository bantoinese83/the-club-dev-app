'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { GitBranch, GitFork, Star, Users } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import Layout from '@/components/templates/Layout'
import { RootState } from '@/lib/store'
import { setStats, setLoading, setError } from '@/features/github/githubSlice'

export function GitHubStats() {
  const dispatch = useDispatch()
  const { stats, isLoading, error } = useSelector((state: RootState) => state.github)

  useEffect(() => {
    fetchGitHubStats()
  }, [])

  const fetchGitHubStats = async () => {
    dispatch(setLoading(true))
    try {
      const response = await fetch('/api/github/stats')
      const data = await response.json()
      if (data.success) {
        dispatch(setStats(data.stats))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      dispatch(setError('Failed to fetch GitHub stats'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Layout isLoading={isLoading}>
      <Card>
        <CardHeader>
          <CardTitle>GitHub Stats</CardTitle>
          <CardDescription>Your GitHub activity at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatItem
              icon={<GitBranch className="h-4 w-4" />}
              label="Public Repos"
              value={stats?.publicRepos}
              isLoading={isLoading}
            />
            <StatItem
              icon={<Users className="h-4 w-4" />}
              label="Followers"
              value={stats?.followers}
              isLoading={isLoading}
            />
            <StatItem
              icon={<Users className="h-4 w-4" />}
              label="Following"
              value={stats?.following}
              isLoading={isLoading}
            />
            <StatItem
              icon={<Star className="h-4 w-4" />}
              label="Total Stars"
              value={stats?.totalStars}
              isLoading={isLoading}
            />
            <StatItem
              icon={<GitFork className="h-4 w-4" />}
              label="Total Forks"
              value={stats?.totalForks}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number | undefined
  isLoading: boolean
}

function StatItem({ icon, label, value, isLoading }: StatItemProps) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <p className="text-sm font-medium">{label}</p>
        {isLoading ? (
          <Skeleton className="h-6 w-12" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </div>
  )
}

