'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { RequiredGoal } from '@/types'

type Goal = RequiredGoal;

interface ProgressTrackingProps {
  setIsLoading: (isLoading: boolean) => void;
}

export function ProgressTracking({ setIsLoading }: ProgressTrackingProps) {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/goals')
      const data = await response.json()
      if (data.success) {
        setGoals(data.goals.map((goal: Partial<Goal>) => ({
          ...goal,
          description: goal.description || '',
          status: goal.status || 'NOT_STARTED',
          progress: goal.progress || 0,
        } as RequiredGoal)))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch goals. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateGoalProgress = async (id: string, newProgress: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress }),
      })
      const data = await response.json()
      if (data.success) {
        setGoals(goals.map(goal => goal.id === id ? { ...goal, progress: newProgress } : goal))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update goal progress. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteGoal = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setGoals(goals.filter(goal => goal.id !== id))
        toast({
          title: 'Goal Deleted',
          description: 'The goal has been successfully deleted.',
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete goal. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (goals.length === 0) {
    return <Loader2 className="h-8 w-8 animate-spin" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p>No goals set. Start by creating a new goal!</p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
                <div className="flex items-center space-x-2">
                  <Progress value={goal.progress} className="flex-grow" />
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                  >
                    -10%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                  >
                    +10%
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}