'use client';

import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  FormControl,
  FormDescription,
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
import { IdUpload } from './id-upload';
import type { SignUpFormData } from '@/app/page';

export const step2Schema = z.object({
  idType: z.string().min(1, 'Please select an ID type.'),
  idNumber: z.string().min(3, 'A valid ID number is required.'),
  idDocument: z
    .instanceof(File, { message: 'ID document is required.' })
    .refine((file) => file.size > 0, 'ID document is required.'),
});

interface Step2IdentityProps {
  form: UseFormReturn<SignUpFormData>;
}

export const Step2Identity: FC<Step2IdentityProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="idType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Document Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID Type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="national_id">National ID Card</SelectItem>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="idNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your document number" {...field} />
            </FormControl>
            <FormDescription>
              Please ensure this matches your document exactly.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="idDocument"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Document</FormLabel>
            <FormControl>
              <IdUpload
                onFileChange={field.onChange}
                fileName={field.value?.name ?? null}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
