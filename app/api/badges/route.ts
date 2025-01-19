import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)
    const badges = await prisma.badge.findMany({
      where: { userId: user.id },
    })

    return NextResponse.json({ success: true, badges })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch badges' }, { status: 500 })
  }
}

