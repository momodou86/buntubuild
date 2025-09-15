'use client';

import { useAuth } from '@/hooks/use-auth';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, loading, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/signin?redirect=/admin');
      return;
    }

    if (!isSuperAdmin) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, isSuperAdmin, router]);

  if (loading || !user || !isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return <AdminDashboard />;
}
