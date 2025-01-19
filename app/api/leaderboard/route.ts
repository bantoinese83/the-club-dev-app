import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        streak: true,
      },
      orderBy: {
        streak: 'desc',
      },
      take: 10,
    })

    return NextResponse.json({ success: true, leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

