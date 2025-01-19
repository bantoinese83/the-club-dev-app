'use client'

import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Button} from '@/components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card'
import {useGeminiAI} from '@/hooks/useGeminiAI'
import {GitCommit, Code} from 'lucide-react'
import {ScrollArea} from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {AlertCircle, CheckCircle2} from 'lucide-react'
import {RootState} from '@/lib/store'
import {setConnected, setCommits, setLoading, setError} from '@/features/github/githubSlice'

interface GitHubIntegrationProps {
    setIsLoadingAction: (isLoading: boolean) => void;
}

export default function GitHubIntegration({setIsLoadingAction}: GitHubIntegrationProps) {
    const dispatch = useDispatch()
    const {isConnected, commits, isLoading, error} = useSelector((state: RootState) => state.github)
    const {reviewCode, isLoading: isAiLoading, error: aiError} = useGeminiAI()
    const [codeReview, setCodeReview] = useState<string>('')

    useEffect(() => {
        checkGitHubConnection()
    }, [])

    useEffect(() => {
        setIsLoadingAction(isLoading || isAiLoading)
    }, [isLoading, isAiLoading, setIsLoadingAction])

    const checkGitHubConnection = async () => {
        dispatch(setLoading(true))
        try {
            const response = await fetch('/api/github/status')
            const data = await response.json()
            dispatch(setConnected(data.isConnected))
            if (data.isConnected) {
                await fetchCommits()
            }
        } catch (error) {
            console.error('Error checking GitHub connection:', error)
            dispatch(setError('Failed to check GitHub connection'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const connectGitHub = async () => {
        dispatch(setLoading(true))
        try {
            const response = await fetch('/api/auth/github')
            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error('Error connecting to GitHub:', error)
            dispatch(setError('Failed to initiate GitHub connection'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const fetchCommits = async () => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const response = await fetch('/api/github/commits')
            const data = await response.json()
            if (data.success) {
                dispatch(setCommits(data.commits))
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error('Error fetching commits:', error)
            dispatch(setError('Failed to fetch commits'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleCodeReview = async (commitId: string) => {
        const commit = commits.find(c => c.id === commitId)
        if (commit) {
            const review = await reviewCode(commit.message)
            setCodeReview(review || '')
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>GitHub Integration</CardTitle>
            </CardHeader>
            <CardContent>
                {!isConnected ? (
                    <Button onClick={connectGitHub} disabled={isLoading}>
                        {isLoading ? 'Connecting...' : 'Connect GitHub'}
                    </Button>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Recent Commits</h3>
                        {error ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : (
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                {commits.map((commit) => (
                                    <div key={commit.id} className="flex items-start space-x-2 mb-2">
                                        <GitCommit className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                                        <div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <p className="font-medium truncate max-w-[300px]">{commit.message}</p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{commit.message}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <p className="text-sm text-muted-foreground">{new Date(commit.date).toLocaleString()}</p>
                                            <Button variant="outline" size="sm" className="mt-1"
                                                    onClick={() => handleCodeReview(commit.id)}>
                                                <Code className="mr-2 h-4 w-4"/>
                                                AI Review
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        )}
                    </div>
                )}
                {aiError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>AI Error</AlertTitle>
                        <AlertDescription>{aiError}</AlertDescription>
                    </Alert>
                )}
                {codeReview && (
                    <Alert className="mt-4">
                        <CheckCircle2 className="h-4 w-4"/>
                        <AlertTitle>AI Code Review</AlertTitle>
                        <AlertDescription>{codeReview}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}