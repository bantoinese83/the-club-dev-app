'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGeminiAI } from '@/hooks/useGeminiAI'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Loader2, BookOpen } from 'lucide-react'

export function LearningRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { generateLearningRecommendations } = useGeminiAI()
  const { logs } = useSelector((state: RootState) => state.dailyLog)

  useEffect(() => {
    generateRecommendations()
  }, [])

  async function generateRecommendations() {
    setIsLoading(true)
    const recentLogs = logs.slice(0, 10).map(log => log.content).join('\n')
    const aiRecommendations = await generateLearningRecommendations(recentLogs)
    if (aiRecommendations) {
      setRecommendations(aiRecommendations.split('\n').filter(Boolean))
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Learning Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
            <Button onClick={generateRecommendations}>
              Refresh Recommendations
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

