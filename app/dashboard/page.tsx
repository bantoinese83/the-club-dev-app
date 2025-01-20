'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import Layout from '@/components/templates/Layout';
import DailyLog from '@/components/DailyLog';
import GitHubIntegration from '@/components/GitHubIntegration';
import Badges from '@/components/organisms/Badges';
import Leaderboard from '@/components/organisms/Leaderboard';
import { GoalSetting } from '@/components/organisms/GoalSetting';
import { ProgressTracking } from '@/components/organisms/ProgressTracking';
import { SearchEntries } from '@/components/organisms/SearchEntries';
import { LearningRecommendations } from '@/components/organisms/LearningRecommendations';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthGuard>
      <Layout isLoading={isLoading}>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DailyLog setIsLoadingAction={setIsLoading} />
          <GitHubIntegration setIsLoadingAction={setIsLoading} />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Badges setIsLoading={setIsLoading} />
          <Leaderboard setIsLoading={setIsLoading} />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <GoalSetting setIsLoadingAction={setIsLoading} />
          <ProgressTracking setIsLoading={setIsLoading} />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <SearchEntries setIsLoadingAction={setIsLoading} />
          <LearningRecommendations />
        </div>
      </Layout>
    </AuthGuard>
  );
}
