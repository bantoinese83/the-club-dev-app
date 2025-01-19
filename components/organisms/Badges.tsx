import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface Badge {
  id: string
  name: string
  description: string
  image: string
}

interface BadgesProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function Badges({ setIsLoading }: BadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/badges')
        const data = await response.json()
        if (data.success) {
          setBadges(data.badges)
        } else {
          setError(data.error)
        }
      } catch (error) {
        setError('Failed to fetch badges')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadges()
  }, [setIsLoading])

  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <p>You haven't earned any badges yet. Keep logging your progress!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center">
                <Image src={badge.image || "/placeholder.svg"} alt={badge.name} width={64} height={64} />
                <h3 className="font-semibold mt-2">{badge.name}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
