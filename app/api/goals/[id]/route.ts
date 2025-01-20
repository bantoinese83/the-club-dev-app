import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params
    const sessionCookie = (await cookies()).get('session')

    if (!sessionCookie) {
        return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)

    try {
        const payload = await request.json()

        if (!payload) {
            return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
        }

        const updatedGoal = await prisma.goal.update({
            where: { id },
            data: payload,
        })

        return NextResponse.json({ success: true, goal: updatedGoal })
    } catch (error) {
        console.error('Error updating goal:', error ?? 'Unknown error')
        return NextResponse.json({ success: false, error: 'Failed to update goal' }, { status: 500 })
    }
}