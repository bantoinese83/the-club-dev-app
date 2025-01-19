'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, TagIcon } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from '@/components/ui/date-picker'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DailyLogEntry, Tag, ReadonlyDailyLogEntry, TagRecord } from '@/types'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

interface DailyLogEntry {
  id: string;
  content: string;
  createdAt: string;
  tags: { id: string; name: string }[];
}

interface Tag {
  id: string;
  name: string;
}

interface SearchEntriesProps {
  setIsLoading: (isLoading: boolean) => void;
}

export function SearchEntries({ setIsLoading }: SearchEntriesProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [searchResults, setSearchResults] = useState<ReadonlyDailyLogEntry[]>([])
  const [tags, setTags] = useState<TagRecord>({})
  const [isLoading, setIsLoadingState] = useState<boolean>(false)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async (): Promise<void> => {
    try {
      const response = await fetch('/api/tags')
      const data = await response.json()
      if (data.success) {
        const tagRecord: TagRecord = {}
        data.tags.forEach((tag: Tag) => {
          tagRecord[tag.id] = tag
        })
        setTags(tagRecord)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tags. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleSearch = async (): Promise<void> => {
    setIsLoading(true)
    setIsLoadingState(true)
    try {
      const queryParams = new URLSearchParams({
        query: searchQuery,
        tags: selectedTags.join(','),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      })

      const response = await fetch(`/api/search?${queryParams}`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.dailyLogs)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search entries. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setIsLoadingState(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            onValueChange={(value) => setSelectedTags([...selectedTags, value])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by tags" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(tags).map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const tag = tags[tagId]
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
          <div className="flex gap-4">
            <DatePicker
              selected={startDate}
              onSelect={setStartDate}
              placeholderText="Start Date"
            />
            <DatePicker
              selected={endDate}
              onSelect={setEndDate}
              placeholderText="End Date"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>
        <Separator className="my-4" />
        <h3 className="text-lg font-semibold mb-2">Search Results</h3>
        {searchResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {searchResults.map((log) => (
              <div key={log.id} className="mb-4 last:mb-0">
                <p>{log.content}</p>
                <div className="flex items-center mt-1">
                  <TagIcon className="h-4 w-4 mr-1" />
                  {log.tags.map((tag) => (
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
        )}
      </CardContent>
    </Card>
  )
}
