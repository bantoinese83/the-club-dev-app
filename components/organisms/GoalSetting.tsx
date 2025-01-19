'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Lightbulb } from 'lucide-react'
import { RequiredGoal } from '@/types'
import { useGeminiAI } from '@/hooks/useGeminiAI'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Start date must be a valid date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'End date must be a valid date',
  }),
})

type GoalFormValues = z.infer<typeof goalSchema>

interface GoalSettingProps {
  setIsLoading: (isLoading: boolean) => void;
}

export function GoalSetting({ setIsLoading }: GoalSettingProps): JSX.Element {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const { generateGoalSuggestions, isLoading: isAiLoading } = useGeminiAI()
  const { currentUser } = useSelector((state: RootState) => state.user)
  const { logs } = useSelector((state: RootState) => state.dailyLog)

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    generateAiSuggestions()
  }, [])

  useEffect(() => {
    setIsLoading(isAiLoading)
  }, [isAiLoading, setIsLoading])

  async function generateAiSuggestions() {
    const userData = {
      name: currentUser?.name,
      email: currentUser?.email,
      streak: currentUser?.streak,
      recentLogs: logs.slice(0, 5).map(log => log.content).join('\n'),
    }
    const suggestions = await generateGoalSuggestions(JSON.stringify(userData))
    if (suggestions) {
      setAiSuggestions(suggestions.split('\n').filter(Boolean))
    }
  }

  async function onSubmit(data: GoalFormValues): Promise<void> {
    setIsLoading(true)
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        const newGoal: RequiredGoal = {
          ...result.goal,
          description: result.goal.description || '',
          status: 'NOT_STARTED',
          progress: 0,
        }
        toast({
          title: 'Goal Created',
          description: 'Your new goal has been successfully created.',
        })
        form.reset()
        generateAiSuggestions()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create goal. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a New Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Complete feature X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your goal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isAiLoading}>
              {isAiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Goal'
              )}
            </Button>
          </form>
        </Form>
        {aiSuggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              AI Goal Suggestions
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
