'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface Goal {
  id: string;
  title: string;
  endDate: string;
}

export function GoalNotifications() {
  useEffect(() => {
    const checkGoals = async () => {
      try {
        const response = await fetch('/api/goals');
        const data = await response.json();
        if (data.success) {
          const today = new Date();
          const upcomingGoals = data.goals.filter((goal: Goal) => {
            const endDate = new Date(goal.endDate);
            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 3 && diffDays > 0;
          });

          upcomingGoals.forEach((goal: Goal) => {
            toast({
              title: 'Upcoming Goal Deadline',
              description: `"${goal.title}" is due in ${Math.ceil((new Date(goal.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days.`,
            });
          });
        }
      } catch (error) {
        console.error('Failed to fetch goals for notifications:', error);
      }
    };

    checkGoals();
    // Check for upcoming goals every day
    const interval = setInterval(checkGoals, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything, it just handles notifications
}
