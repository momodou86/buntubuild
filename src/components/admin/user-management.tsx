'use client';

import * as React from 'react';
import type { UserRecord } from 'firebase-admin/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserManagementProps {
  users: UserRecord[];
}

export function UserManagement({ users }: UserManagementProps) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
        </div>
        <Card>
        <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user.uid}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.photoURL || undefined} alt="Avatar" />
                                <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <p className="font-medium">{user.displayName || 'No Name'}</p>
                                <p className="text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                    <Badge variant={user.customClaims?.super_admin ? 'default' : 'secondary'}>
                        {user.customClaims?.super_admin ? 'Admin' : 'User'}
                    </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                    {new Date(user.metadata.creationTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Disable Account</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
