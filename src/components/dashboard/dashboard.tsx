'use client';

import { useState } from 'react';
import { addMonths, differenceInMonths } from 'date-fns';
import { Header } from '@/components/dashboard/header';
import { ProgressSummary } from '@/components/dashboard/progress-summary';
import { GoalSettings } from '@/components/dashboard/goal-settings';
import { AiAdvisor } from '@/components/dashboard/ai-advisor';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Achievements } from '@/components/dashboard/achievements';
import { CommunityFeed } from '@/components/dashboard/community-feed';
import { EscrowAccount } from './escrow-account';

export function Dashboard() {
  const [savingsGoal, setSavingsGoal] = useState(2500000); // GMD
  const [currentSavings, setCurrentSavings] = useState(485000);
  const [monthlyContribution, setMonthlyContribution] = useState(75000);
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    addMonths(new Date(), 30)
  );

  const monthsRemaining = targetDate
    ? differenceInMonths(targetDate, new Date())
    : 0;
  const projectedSavings =
    currentSavings + monthlyContribution * Math.max(0, monthsRemaining);
  const onTrack = projectedSavings >= savingsGoal;

  const handleGoalUpdate = (data: {
    savingsGoal: number;
    monthlyContribution: number;
    targetDate?: Date;
  }) => {
    setSavingsGoal(data.savingsGoal);
    setMonthlyContribution(data.monthlyContribution);
    setTargetDate(data.targetDate);
  };

  const handleTopUp = (amount: number) => {
    setCurrentSavings((prev) => prev + amount);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            <ProgressSummary
              currentSavings={currentSavings}
              savingsGoal={savingsGoal}
              monthlyContribution={monthlyContribution}
              onTrack={onTrack}
              targetDate={targetDate}
            />
            <GoalSettings
              savingsGoal={savingsGoal}
              monthlyContribution={monthlyContribution}
              targetDate={targetDate}
              onUpdate={handleGoalUpdate}
            />
             <EscrowAccount />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
            <AiAdvisor
              savingsGoal={savingsGoal}
              currentSavings={currentSavings}
              targetDate={targetDate}
            />
            <QuickActions onTopUp={handleTopUp} />
            <Achievements />
            <CommunityFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
