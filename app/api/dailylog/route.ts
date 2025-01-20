import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { DailyLogEntry, User } from '@/types'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    const sessionCookie = (await cookies()).get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value) as User

    const dailyLog = await prisma.dailyLog.create({
      data: {
        content,
        userId: user.id,
      },
    })

    // Update user streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        streak: {
          increment: user.lastLogDate && new Date(user.lastLogDate) >= today ? 0 : 1
        },
        lastLogDate: today,
      },
    })

    // Check for new badges
    const newBadges = []

    if (updatedUser.streak === 7) {
      newBadges.push({
        name: '7 Day Streak',
        description: 'Logged progress for 7 consecutive days',
        image: '/badges/7-day-streak.png',
      })
    } else if (updatedUser.streak === 30) {
      newBadges.push({
        name: '30 Day Streak',
        description: 'Logged progress for 30 consecutive days',
        image: '/badges/30-day-streak.png',
      })
    }

    if (newBadges.length > 0) {
      await prisma.badge.createMany({
        data: newBadges.map(badge => ({ ...badge, userId: user.id })),
      })
    }

    return NextResponse.json({ success: true, dailyLog, streak: updatedUser.streak, newBadges })
  } catch (error) {
    console.error('Daily log error:', error)
    return NextResponse.json({ success: false, error: 'An error occurred while saving the daily log' }, { status: 500 })
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const sessionCookie = (await cookies()).get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value) as User
    const dailyLogs = await prisma.dailyLog.findMany({
      where: {userId: user.id},
      orderBy: {createdAt: 'desc'},
      include: {tags: true},
    }) as unknown as DailyLogEntry[]

    return NextResponse.json({ success: true, dailyLogs })
  } catch (error) {
    console.error('Fetch daily logs error:', error)
    return NextResponse.json({ success: false, error: 'An error occurred while fetching daily logs' }, { status: 500 })
  }
}

