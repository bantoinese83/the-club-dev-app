import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const user = JSON.parse(sessionCookie.value);
    const githubProfile = await prisma.githubProfile.findUnique({
      where: { userId: user.id },
    });

    if (!githubProfile) {
      return NextResponse.json(
        { success: false, error: 'GitHub not connected' },
        { status: 400 },
      );
    }

    // Fetch commits from GitHub API using githubProfile.accessToken
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${githubProfile.accessToken}`,
      },
    });

    const repos = await response.json();
    const recentCommits = [];

    for (const repo of repos.slice(0, 5)) {
      // Limit to 5 repos for performance
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits`,
        {
          headers: {
            Authorization: `Bearer ${githubProfile.accessToken}`,
          },
        },
      );
      const commits = await commitsResponse.json();
      recentCommits.push(...commits.slice(0, 5)); // Get 5 most recent commits per repo
    }

    const formattedCommits = recentCommits.map((commit) => ({
      id: commit.sha,
      message: commit.commit.message,
      date: commit.commit.author.date,
    }));

    return NextResponse.json({ success: true, commits: formattedCommits });
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch commits' },
      { status: 500 },
    );
  }
}
