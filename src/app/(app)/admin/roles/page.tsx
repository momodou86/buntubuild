
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Edit, Shield, User } from 'lucide-react';

const roles = [
  {
    name: 'Admin',
    description: 'Has full access to all system features, including user management and settings.',
    icon: Shield,
    permissions: [
      'View Dashboard',
      'Manage Users',
      'View Transactions',
      'Approve Releases',
      'Manage Roles',
      'Access Settings',
    ],
  },
  {
    name: 'User',
    description: 'Standard user with access to their own dashboard and savings goals.',
    icon: User,
    permissions: [
      'View Dashboard',
      'Manage Own Savings',
      'Request Fund Releases',
      'View Own Transactions',
    ],
  },
];

export default function AdminRolesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Roles & Permissions</h1>
        <Button>Add New Role</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Roles</CardTitle>
          <CardDescription>
            Define roles and their permissions within the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.name}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-muted rounded-full">
                        <role.icon className="h-5 w-5 text-muted-foreground" />
                       </div>
                       <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-sm text-muted-foreground hidden sm:block">{role.description}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 max-w-md">
                        {role.permissions.map(permission => (
                             <Badge key={permission} variant="secondary" className="font-normal">
                                <Check className="h-3 w-3 mr-1 text-primary"/>
                                {permission}
                            </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Role</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
