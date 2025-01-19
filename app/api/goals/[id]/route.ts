import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = cookies().get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)
    const { title, description, startDate, endDate, status, progress } = await request.json()

    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        progress,
      },
    })

    return NextResponse.json({ success: true, goal: updatedGoal })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json({ success: false, error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = cookies().get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    await prisma.goal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete goal' }, { status: 500 })
  }
}

