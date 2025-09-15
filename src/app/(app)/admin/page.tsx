'use server';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = auth.currentUser;

  if (!user) {
    redirect('/admin');
  }

  const profile = await getUserProfile(user.uid);

  if (!profile?.isAdmin) {
    redirect('/dashboard');
  }

  return <AdminDashboard />;
}
