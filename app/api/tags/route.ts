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
    const tags = await prisma.tag.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ success: true, tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sessionCookie = cookies().get('session')
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)
    const { name } = await request.json()

    const tag = await prisma.tag.create({
      data: {
        name,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, tag })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ success: false, error: 'Failed to create tag' }, { status: 500 })
  }
}

