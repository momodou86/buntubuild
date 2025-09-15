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
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { SignUpFormData } from '@/app/page';

export const step3Schema = z.object({
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy.',
  }),
});

interface Step3AgreementsProps {
  form: UseFormReturn<SignUpFormData>;
}

export const Step3Agreements: FC<Step3AgreementsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I agree to the{' '}
                <a href="#" className="underline text-primary">
                  Terms and Conditions
                </a>
                .
              </FormLabel>
              <FormDescription>
                This includes our service terms, fees, and escrow agreement.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="privacy"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I agree to the{' '}
                <a href="#" className="underline text-primary">
                  Privacy Policy
                </a>
                .
              </FormLabel>
              <FormDescription>
                We are committed to protecting your data.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
