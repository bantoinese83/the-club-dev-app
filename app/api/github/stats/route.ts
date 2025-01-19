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
    const githubProfile = await prisma.githubProfile.findUnique({ where: { userId: user.id } })

    if (!githubProfile) {
      return NextResponse.json({ success: false, error: 'GitHub not connected' }, { status: 400 })
    }

    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubProfile.accessToken}`,
      },
    })

    const userData = await response.json()

    // Fetch starred repositories
    const starredResponse = await fetch('https://api.github.com/user/starred', {
      headers: {
        Authorization: `Bearer ${githubProfile.accessToken}`,
      },
    })

    const starredRepos = await starredResponse.json()

    // Calculate total stars and forks
    let totalStars = 0
    let totalForks = 0

    const reposResponse = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${githubProfile.accessToken}`,
      },
    })

    const repos = await reposResponse.json()

    repos.forEach((repo: any) => {
      totalStars += repo.stargazers_count
      totalForks += repo.forks_count
    })

    const stats = {
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      totalForks,
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch GitHub stats' }, { status: 500 })
  }
}

