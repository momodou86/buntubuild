'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const settingsSchema = z.object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Current password is required to set a new password.',
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      message: 'New password must be at least 8 characters.',
      path: ['newPassword'],
    }
  );


type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    setError(null);
    try {
        await updateProfile(data.fullName, data.currentPassword, data.newPassword);
        toast({
            title: 'Profile Updated',
            description: 'Your account settings have been successfully updated.',
            className: 'bg-primary text-primary-foreground',
        });
        form.reset({
            ...data,
            currentPassword: '',
            newPassword: '',
        });
    } catch (err: any) {
         let message = 'An unexpected error occurred. Please try again.';
          if (err.code) {
            switch (err.code) {
              case 'auth/wrong-password':
                message = 'The current password you entered is incorrect.';
                break;
              case 'auth/requires-recent-login':
                message = 'This operation is sensitive and requires recent authentication. Please sign out and sign in again before updating your password.';
                break;
              default:
                 message = `An error occurred: ${err.message}`;
            }
          }
          setError(message);
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                        <AlertTitle>Update Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                    </div>
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} placeholder="Enter current password to change it"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} placeholder="Enter new password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading || authLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
