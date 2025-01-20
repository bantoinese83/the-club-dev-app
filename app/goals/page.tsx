'use client';

import { AuthGuard } from '@/components/AuthGuard';
import Layout from '@/components/templates/Layout';
import { GoalSetting } from '@/components/organisms/GoalSetting';
import { ProgressTracking } from '@/components/organisms/ProgressTracking';
import { useState } from 'react';

export default function GoalsPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthGuard>
      <Layout isLoading={isLoading}>
        <h1 className="text-3xl font-bold mb-8">Goals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GoalSetting setIsLoadingAction={setIsLoading} />
          <ProgressTracking setIsLoading={setIsLoading} />
        </div>
      </Layout>
    </AuthGuard>
  );
}
