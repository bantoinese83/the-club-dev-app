'use client'

import React, { useState, useEffect, JSX } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useGeminiAI } from '@/hooks/useGeminiAI'
import { TagIcon, Smile, Frown, Meh } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { RootState } from '@/lib/store'
import { setLogs, addLog, setTags, setLoading, setError } from '@/features/dailyLog/dailyLogSlice'

interface DailyLogProps {
  setIsLoadingAction: (isLoading: boolean) => void;
}

export default function DailyLog({ setIsLoadingAction }: DailyLogProps): JSX.Element {
  const dispatch = useDispatch()
  const { logs, tags, isLoading, error } = useSelector((state: RootState) => state.dailyLog)
  const { currentUser } = useSelector((state: RootState) => state.user)

  const [logEntry, setLogEntry] = useState<string>('')
  const [aiInsights, setAiInsights] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sentiment, setSentiment] = useState<string | null>(null)
  const { generateInsights, generateTags, analyzeSentiment, isLoading: isAiLoading, error: aiError } = useGeminiAI()

  useEffect(() => {
    fetchDailyLogs()
    fetchTags()
  }, [])

  useEffect(() => {
    setIsLoadingAction(isLoading || isAiLoading)
  }, [isLoading, isAiLoading, setIsLoadingAction])

  const fetchDailyLogs = async (): Promise<void> => {
    dispatch(setLoading(true))
    try {
      const response = await fetch('/api/dailylog')
      const data = await response.json()
      if (data.success) {
        dispatch(setLogs(data.dailyLogs))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      dispatch(setError('Failed to fetch daily logs'))
      toast({
        title: "Error",
        description: "Failed to fetch daily logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchTags = async (): Promise<void> => {
    try {
      const response = await fetch('/api/tags')
      const data = await response.json()
      if (data.success) {
        dispatch(setTags(data.tags))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tags. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const aiTags = await generateTags(logEntry)
      const aiSentiment = await analyzeSentiment(logEntry)

      const response = await fetch('/api/dailylog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: logEntry, tagIds: selectedTags, aiTags, sentiment: aiSentiment || '' }),
      })

      const data = await response.json()

      if (data.success) {
        dispatch(addLog(data.dailyLog))
        if (data.newBadges && data.newBadges.length > 0) {
          data.newBadges.forEach((badge: { name: string }) => {
            toast({
              title: "New Badge Earned!",
              description: `You've earned the "${badge.name}" badge!`,
            })
          })
        }
        const insights = await generateInsights(`Analyze the following developer log entry and provide insights or suggestions: "${logEntry}"`)
        if (insights) {
          setAiInsights(insights)
        }
        setSentiment(aiSentiment)
        setLogEntry('')
        setSelectedTags([])
        toast({
          title: "Success",
          description: "Daily log entry saved successfully.",
          variant: "default",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      dispatch(setError('An error occurred while saving the daily log'))
      toast({
        title: "Error",
        description: "Failed to save daily log entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  const renderSentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="h-6 w-6 text-green-500" />;
      case 'negative':
        return <Frown className="h-6 w-6 text-red-500" />;
      case 'neutral':
        return <Meh className="h-6 w-6 text-yellow-500" />;
      default:
        return null;
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-lg font-semibold">Current Streak: <span className="text-primary">{currentUser?.streak || 0} days</span></p>
        </div>
        <form id="daily-log-form" onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={logEntry}
            onChange={(e) => setLogEntry(e.target.value)}
            placeholder="What did you work on today?"
            className="min-h-[100px]"
          />
          <Select onValueChange={(value) => setSelectedTags([...selectedTags, value])}>
            <SelectTrigger>
              <SelectValue placeholder="Add tags" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const tag = tags.find(t => t.id === tagId)
              return tag ? (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                  <button
                    className="ml-1 text-xs"
                    onClick={() => setSelectedTags(selectedTags.filter((id) => id !== tagId))}
                  >
                    ×
                  </button>
                </Badge>
              ) : null
            })}
          </div>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {aiError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>AI Error</AlertTitle>
            <AlertDescription>{aiError}</AlertDescription>
          </Alert>
        )}
        {aiInsights && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>AI Insights</AlertTitle>
            <AlertDescription>{aiInsights}</AlertDescription>
          </Alert>
        )}
        {sentiment && (
          <div className="mt-4 flex items-center">
            <span className="mr-2">Sentiment:</span>
            {renderSentimentIcon()}
          </div>
        )}
        <Separator className="my-4" />
        <h3 className="text-lg font-semibold mb-2">Recent Logs</h3>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {logs.map((log) => (
            <div key={log.id} className="mb-4 last:mb-0">
              <p>{log.content}</p>
              <div className="flex items-center mt-1">
                <TagIcon className="h-4 w-4 mr-1" />
                {log.tags && log.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="mr-1">
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="daily-log-form" disabled={isLoading || isAiLoading}>
          {isLoading || isAiLoading ? 'Processing...' : 'Log Progress'}
        </Button>
      </CardFooter>
    </Card>
  )
}