'use client';

import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Globe, Lock } from 'lucide-react';
import type { SignUpFormData } from '@/app/signup/page';

export const step1Schema = z.object({
  fullName: z.string().min(3, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  countryOfResidence: z.string().min(1, 'Please select your country.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

interface Step1AccountProps {
  form: UseFormReturn<SignUpFormData>;
}

export const Step1Account: FC<Step1AccountProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="e.g., Awa Njie" {...field} className="pl-10" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="you@example.com"
                  {...field}
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="countryOfResidence"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Residence</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </div>
              </FormControl>
              <SelectContent>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="es">Spain</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
