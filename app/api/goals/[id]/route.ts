import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Await the params object to ensure its properties are available
  const { id } = await params

  try {
    // Parse the request body as JSON
    const { title, description, startDate, endDate, status } = await request.json()

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
    })

    return NextResponse.json({ success: true, goal: updatedGoal })
  } catch (error) {
    console.error('Error updating goal:', error ?? 'Unknown error')
    return NextResponse.json({ success: false, error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.goal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error ?? 'Unknown error')
    return NextResponse.json({ success: false, error: 'Failed to delete goal' }, { status: 500 })
  }
}