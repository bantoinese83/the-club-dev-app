import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const session = (await cookies()).get('session');

  if (session) {
    return NextResponse.json({ user: JSON.parse(session.value) });
  }

  return NextResponse.json({ user: null });
}
