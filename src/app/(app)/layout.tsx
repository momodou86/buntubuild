'use client';

import { useAuth } from '@/hooks/use-auth';
import type { User } from 'firebase/auth';
import { getUserProfile, updateUserCurrency } from '@/lib/firestore';
import type { UserProfile } from '@/lib/firestore';
import { Header } from '@/components/dashboard/header';
import { useEffect, useState } from 'react';
import type { Currency } from '@/components/dashboard/dashboard';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
        }
      }
    }
    fetchProfile();
  }, [user]);

  const handleSetCurrency = async (newCurrency: Currency) => {
    if (user && profile) {
      await updateUserCurrency(user.uid, newCurrency);
      setProfile({ ...profile, currency: newCurrency });
    }
  };

  const showHeader = !pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      {showHeader && profile && (
        <Header
          currency={profile.currency}
          setCurrency={handleSetCurrency}
          isSuperAdmin={profile.isAdmin}
        />
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
