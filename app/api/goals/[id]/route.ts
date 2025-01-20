import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = (await cookies()).get('session')

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { title, description } = await request.json()

    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
      data: {
        title,
        description,
      },
    })

    return NextResponse.json({ success: true, goal: updatedGoal })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json({ success: false, error: 'Failed to update goal' }, { status: 500 })
  }
}