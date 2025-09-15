'use server';

import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default async function AdminPage() {
  // The authentication and admin checks are handled by the layout and client-side
  // components. Attempting to check auth.currentUser on the server here will
  // always be null and cause a redirect loop.
  return <AdminDashboard />;
}
