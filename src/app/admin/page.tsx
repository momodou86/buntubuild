'use client';

import { useAuth } from '@/hooks/use-auth';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/firestore';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/signin?redirect=/admin');
      return;
    }

    async function checkAdminStatus() {
      const profile = await getUserProfile(user!.uid);
      if (profile && profile.isAdmin) {
        setIsAdmin(true);
      } else {
        router.push('/dashboard');
      }
      setLoading(false);
    }

    checkAdminStatus();
  }, [user, authLoading, router]);

  if (loading || authLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return <AdminDashboard />;
}
