import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // Clear the session cookie
  (await cookies()).delete('session')

  return NextResponse.json({ message: 'Logged out successfully' })
}

