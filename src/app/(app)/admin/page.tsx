
'use server';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { getAllUsers, getAllTransactions } from '@/app/actions';
import type { Transaction } from '@/lib/firestore';

// This is the same hardcoded data from the releases page.
// In a real app, this would be fetched from a database.
const initialReleases = [
  {
    id: 'REL-001',
    status: 'pending',
  },
  {
    id: 'REL-002',
    status: 'pending',
  },
  {
    id: 'REL-003',
    status: 'approved',
  },
];


export default async function AdminPage() {
  let totalUsers = 0;
  let transactions: Transaction[] = [];
  let pendingReleasesCount = 0;

  try {
    const users = await getAllUsers();
    totalUsers = users.length;
    transactions = await getAllTransactions();
    pendingReleasesCount = initialReleases.filter(r => r.status === 'pending').length;
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    // The dashboard will show 0 for metrics if fetching fails.
    // The individual pages will show more specific errors.
  }

  const totalVolume = transactions
    .filter(t => t.date.getMonth() === new Date().getMonth() && t.date.getFullYear() === new Date().getFullYear())
    .reduce((sum, t) => sum + t.amount, 0);


  return <AdminDashboard 
    totalUsers={totalUsers}
    totalVolume={totalVolume}
    pendingReleasesCount={pendingReleasesCount}
    rolesCount={2} // Currently 2 roles are hardcoded
  />;
}
