import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const tagIds = searchParams.get('tags')?.split(',') || []
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: user.id,
        content: {
          contains: query || undefined,
          mode: 'insensitive',
        },
        tags: tagIds.length > 0 ? {
          some: {
            id: {
              in: tagIds,
            },
          },
        } : undefined,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, dailyLogs })
  } catch (error) {
    console.error('Error searching daily logs:', error)
    return NextResponse.json({ success: false, error: 'Failed to search daily logs' }, { status: 500 })
  }
}

