'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Shield, DollarSign, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminDashboard() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className="cursor-pointer hover:bg-muted"
            onClick={() => handleNavigation('/admin/users')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User Management
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground">
                Total registered users
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:bg-muted"
            onClick={() => handleNavigation('/admin/transactions')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transactions
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">D2.5M</div>
              <p className="text-xs text-muted-foreground">
                Total volume this month
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:bg-muted"
            onClick={() => handleNavigation('/admin/releases')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Releases
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:bg-muted"
            onClick={() => handleNavigation('/admin/roles')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Roles & Permissions
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active admin roles</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                An overview of the latest platform activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Activity feed will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </main>
  );
}
