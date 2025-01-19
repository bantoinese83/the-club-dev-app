import { NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`

export async function GET() {
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}`
  return NextResponse.json({ url })
}

