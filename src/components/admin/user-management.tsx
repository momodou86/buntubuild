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
import { MoreHorizontal, UserX, UserCheck, Eye, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { toggleUserDisabled } from '@/app/actions';

interface UserManagementProps {
  users: UserRecord[];
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const { toast } = useToast();
  const [users, setUsers] = React.useState(initialUsers);
  const [selectedUser, setSelectedUser] = React.useState<UserRecord | null>(null);
  const [isDisabling, setIsDisabling] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const handleToggleDisabled = async (user: UserRecord) => {
    setIsDisabling(true);
    const result = await toggleUserDisabled(user.uid, !user.disabled);
    setIsDisabling(false);
    setIsAlertOpen(false);

    if (result.success) {
      setUsers(users.map(u => u.uid === user.uid ? { ...u, disabled: !user.disabled } : u));
      toast({
        title: `User ${user.disabled ? 'Enabled' : 'Disabled'}`,
        description: `${user.displayName || user.email} has been successfully ${user.disabled ? 'enabled' : 'disabled'}.`,
        className: 'bg-primary text-primary-foreground',
      });
    } else {
      toast({
        title: 'Error',
        description: result.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const openConfirmationDialog = (user: UserRecord) => {
    setSelectedUser(user);
    setIsAlertOpen(true);
  };
  
  const openDetailsDialog = (user: UserRecord) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  }

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
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user.uid} className={user.disabled ? 'opacity-60' : ''}>
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
                      <Badge variant={user.disabled ? 'destructive' : 'secondary'}>
                        {user.disabled ? 'Disabled' : 'Enabled'}
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
                        <DropdownMenuItem onClick={() => openDetailsDialog(user)}>
                            <Eye className="mr-2" />
                            View Profile
                        </DropdownMenuItem>
                         <DropdownMenuItem
                            onClick={() => openConfirmationDialog(user)}
                            className={user.disabled ? 'text-green-600 focus:text-green-700' : 'text-destructive focus:text-destructive'}
                            disabled={user.customClaims?.super_admin}
                          >
                            {user.disabled ? <UserCheck className="mr-2"/> : <UserX className="mr-2"/>}
                            {user.disabled ? 'Enable Account' : 'Disable Account'}
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
        
        {/* Confirmation Dialog for Disabling/Enabling */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will {selectedUser?.disabled ? 'enable' : 'disable'} the account for{' '}
                        <span className="font-semibold">{selectedUser?.displayName || selectedUser?.email}</span>.
                        {selectedUser?.disabled ? ' They will be able to sign in again.' : ' They will no longer be able to sign in.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => selectedUser && handleToggleDisabled(selectedUser)}
                        disabled={isDisabling}
                        className={selectedUser?.disabled ? 'bg-primary' : 'bg-destructive'}
                    >
                        {isDisabling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {selectedUser?.disabled ? 'Enable' : 'Disable'} Account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

         {/* User Details Dialog */}
         <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            {selectedUser && (
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Information for {selectedUser.displayName || selectedUser.email}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span className="font-semibold text-muted-foreground">Full Name</span>
                            <span>{selectedUser.displayName || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span className="font-semibold text-muted-foreground">Email</span>
                            <span>{selectedUser.email}</span>
                        </div>
                         <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span className="font-semibold text-muted-foreground">User ID</span>
                            <span className="font-mono text-xs">{selectedUser.uid}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span className="font-semibold text-muted-foreground">Role</span>
                            <Badge variant={selectedUser.customClaims?.super_admin ? 'default' : 'secondary'}>
                                {selectedUser.customClaims?.super_admin ? 'Admin' : 'User'}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span className="font-semibold text-muted-foreground">Status</span>
                             <Badge variant={selectedUser.disabled ? 'destructive' : 'default'} className={selectedUser.disabled ? '' : 'bg-primary/20 text-primary border-primary/30'}>
                                {selectedUser.disabled ? 'Disabled' : 'Enabled'}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span className="font-semibold text-muted-foreground">Created On</span>
                            <span>{formatTimestamp(selectedUser.metadata.creationTime)}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <span className="font-semibold text-muted-foreground">Last Signed In</span>
                            <span>{formatTimestamp(selectedUser.metadata.lastSignInTime)}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    </main>
  );
}
