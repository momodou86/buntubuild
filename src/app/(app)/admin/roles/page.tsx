
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Edit, Shield, User, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRoles, createRole, updateRole } from '@/app/actions';
import type { Role } from '@/lib/firestore-roles';
import { cn } from '@/lib/utils';


const allPermissions = [
  'View Dashboard',
  'Manage Users',
  'View Transactions',
  'Approve Releases',
  'Manage Roles',
  'Access Settings',
  'Manage Own Savings',
  'Request Fund Releases',
  'View Own Transactions',
];

const roleSchema = z.object({
  name: z.string().min(3, 'Role name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  permissions: z.array(z.string()).min(1, 'At least one permission must be selected.'),
});

type RoleFormData = z.infer<typeof roleSchema>;

const getIconForRole = (roleName: string) => {
    switch (roleName.toLowerCase()) {
        case 'admin': return Shield;
        default: return User;
    }
}

export default function AdminRolesPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });
  
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
        const fetchedRoles = await getRoles();
        setRoles(fetchedRoles);
    } catch (error) {
        toast({
            title: 'Error fetching roles',
            description: 'Could not load roles from the database.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
        if (editingRole) {
            form.reset({
                name: editingRole.name,
                description: editingRole.description,
                permissions: editingRole.permissions,
            });
        } else {
            form.reset({
                name: '',
                description: '',
                permissions: [],
            });
        }
    }
  }, [isDialogOpen, editingRole, form]);


  const onSubmit = async (data: RoleFormData) => {
    form.clearErrors();
    try {
        if (editingRole) {
          await updateRole(editingRole.id, {
            description: data.description,
            permissions: data.permissions,
          });
          toast({
            title: 'Role Updated',
            description: `The role "${data.name}" has been successfully updated.`,
            className: 'bg-primary text-primary-foreground',
          });
        } else {
          await createRole({ 
              name: data.name,
              description: data.description,
              permissions: data.permissions,
          });
          toast({
              title: 'Role Created',
              description: `The role "${data.name}" has been successfully created.`,
              className: 'bg-primary text-primary-foreground',
          });
        }
        await fetchRoles(); // Refetch roles
        setEditingRole(null);
        setIsDialogOpen(false);
    } catch (error: any) {
         toast({
            title: 'Operation Failed',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    }
  };

  const handleOpenDialog = (role: Role | null = null) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  }

  const isCoreRole = (roleName: string) => ['Admin', 'User'].includes(roleName);


  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading Roles...</p>
        </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Roles & Permissions</h1>
         <Dialog open={isDialogOpen} onOpenChange={(open) => {
             if (!open) setEditingRole(null);
             setIsDialogOpen(open);
         }}>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2" />
                    Add New Role
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{editingRole ? 'Edit Role' : 'Create a New Role'}</DialogTitle>
                            <DialogDescription>
                               {editingRole ? `Update the details for the "${editingRole.name}" role.` : 'Define a new role and assign specific permissions.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Support Agent" {...field} disabled={!!editingRole} />
                                        </FormControl>
                                        {editingRole && (
                                            <FormDescription>Role names cannot be changed.</FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the responsibilities of this role..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="permissions"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Permissions</FormLabel>
                                            <FormDescription>
                                                Select the permissions for this role. Core 'Admin' permissions cannot be changed.
                                            </FormDescription>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {allPermissions.map((permission) => (
                                                <FormField
                                                    key={permission}
                                                    control={form.control}
                                                    name="permissions"
                                                    render={({ field }) => {
                                                        const isDisabled = editingRole?.name === 'Admin';
                                                        return (
                                                        <FormItem
                                                            key={permission}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(permission)}
                                                                disabled={isDisabled}
                                                                onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, permission])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                        (value) => value !== permission
                                                                        )
                                                                    )
                                                                }}
                                                            />
                                                            </FormControl>
                                                            <FormLabel className={cn("font-normal", isDisabled && "text-muted-foreground")}>
                                                                {permission}
                                                            </FormLabel>
                                                        </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                             <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingRole ? 'Save Changes' : 'Create Role'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
         </Dialog>
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
              {roles.map((role) => {
                const Icon = getIconForRole(role.name);
                return (
                    <TableRow key={role.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                            <Icon className="h-5 w-5 text-muted-foreground" />
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
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(role)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit Role</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                )
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

    