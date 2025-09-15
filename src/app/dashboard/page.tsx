
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Dashboard } from '@/components/dashboard/dashboard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, type UserProfile } from '@/lib/firestore';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/signin');
      return;
    }

    async function fetchData() {
      const userProfile = await getUserProfile(user!.uid);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        // This case can happen if profile creation failed.
        // Redirecting to signup might be a good way to recover.
        router.push('/signup');
      }
      setLoading(false);
    }

    fetchData();
  }, [user, authLoading, router]);

  if (loading || authLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return <Dashboard user={user} profile={profile} />;
}
