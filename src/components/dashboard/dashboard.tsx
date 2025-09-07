
'use client';

import { useState, useEffect } from 'react';
import { addMonths, differenceInMonths } from 'date-fns';
import { Header } from '@/components/dashboard/header';
import { ProgressSummary } from '@/components/dashboard/progress-summary';
import { GoalSettings } from '@/components/dashboard/goal-settings';
import { AiAdvisor } from '@/components/dashboard/ai-advisor';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Achievements } from '@/components/dashboard/achievements';
import { CommunityFeed } from '@/components/dashboard/community-feed';
import { EscrowAccount } from './escrow-account';
import type { Goal } from '@/components/dashboard/goal-settings';
import { useAuth } from '@/hooks/use-auth';
import { getUserProfile, updateUserCurrency } from '@/lib/firestore';
import type { UserProfile, Transaction } from '@/lib/firestore';
import { getTransactions, addTransaction } from '@/lib/firestore';
import { addTransactionAction, handleGoalUpdateAction } from '@/app/actions';

export type Currency = 'GMD' | 'USD' | 'GBP';

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoading(true);
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
          const userTransactions = await getTransactions(user.uid);
          setTransactions(userTransactions);
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  
  if (loading || !profile) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const {
    goals,
    currentSavings,
    monthlyContribution,
    targetDate,
    currency,
  } = profile;

  const savingsGoal = goals.reduce((sum, goal) => sum + goal.amount, 0);

  const monthsRemaining = targetDate
    ? differenceInMonths(targetDate, new Date()) + 1
    : 0;

  const projectedSavings =
    currentSavings + monthlyContribution * Math.max(0, monthsRemaining);
  const onTrack = projectedSavings >= savingsGoal;

  const handleGoalUpdate = async (data: {
    goals: Goal[];
    monthlyContribution: number;
    targetDate?: Date;
  }) => {
    if (user) {
      await handleGoalUpdateAction(user.uid, data);
      const updatedProfile = await getUserProfile(user.uid);
      if (updatedProfile) setProfile(updatedProfile);
    }
  };

  const handleTopUp = async (amount: number) => {
    if (user) {
      await addTransactionAction(user.uid, {
        type: 'CONTRIBUTION',
        description: 'Top-up contribution',
        amount: amount,
        date: new Date(),
      });
      const updatedProfile = await getUserProfile(user.uid);
       if (updatedProfile) setProfile(updatedProfile);
      const userTransactions = await getTransactions(user.uid);
      setTransactions(userTransactions);
    }
  };
  
  const handleSetCurrency = async (newCurrency: Currency) => {
      if(user) {
          await updateUserCurrency(user.uid, newCurrency);
          const updatedProfile = await getUserProfile(user.uid);
          if (updatedProfile) setProfile(updatedProfile);
      }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header currency={currency} setCurrency={handleSetCurrency} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            <ProgressSummary
              currentSavings={currentSavings}
              savingsGoal={savingsGoal}
              monthlyContribution={monthlyContribution}
              onTrack={onTrack}
              targetDate={targetDate}
              currency={currency}
            />
            <GoalSettings
              goals={goals}
              monthlyContribution={monthlyContribution}
              targetDate={targetDate}
              onUpdate={handleGoalUpdate}
              currency={currency}
              currentSavings={currentSavings}
            />
            <EscrowAccount currency={currency} transactions={transactions} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
            <AiAdvisor
              savingsGoal={savingsGoal}
              currentSavings={currentSavings}
              targetDate={targetDate}
              currency={currency}
            />
            <QuickActions onTopUp={handleTopUp} currency={currency} />
            <Achievements />
            <CommunityFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
