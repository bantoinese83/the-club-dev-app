import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ isConnected: false })
    }

    const user = JSON.parse(sessionCookie.value)
    const githubProfile = await prisma.githubProfile.findUnique({ where: { userId: user.id } })

    return NextResponse.json({ isConnected: !!githubProfile })
  } catch (error) {
    console.error('Error checking GitHub status:', error)
    return NextResponse.json({ isConnected: false, error: 'Failed to check GitHub status' }, { status: 500 })
  }
}

