import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const sessionCookie = cookies().get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)
    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { endDate: 'asc' },
    })

    return NextResponse.json({ success: true, goals })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch goals' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sessionCookie = cookies().get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)
    const { title, description, startDate, endDate } = await request.json()

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'NOT_STARTED',
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, goal })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ success: false, error: 'Failed to create goal' }, { status: 500 })
  }
}

