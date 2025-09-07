'use client';

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const goalSchema = z.object({
  savingsGoal: z.coerce
    .number()
    .min(10000, 'Savings goal must be at least 10,000.'),
  monthlyContribution: z.coerce
    .number()
    .min(1000, 'Monthly contribution must be at least 1,000.'),
  targetDate: z.date().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalSettingsProps {
  savingsGoal: number;
  monthlyContribution: number;
  targetDate?: Date;
  onUpdate: (data: GoalFormData) => void;
}

export const GoalSettings: FC<GoalSettingsProps> = ({
  savingsGoal,
  monthlyContribution,
  targetDate,
  onUpdate,
}) => {
  const { toast } = useToast();
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      savingsGoal,
      monthlyContribution,
      targetDate,
    },
  });

  const onSubmit = (data: GoalFormData) => {
    onUpdate(data);
    toast({
      title: 'Goal Updated',
      description: 'Your savings plan has been successfully updated.',
      className: 'bg-primary text-primary-foreground'
    });
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Plan Your Build</CardTitle>
        <CardDescription>
          Define your savings goal and set a target date for your home construction.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="savingsGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Savings Goal (GMD)</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2,500,000" {...field} className="pl-10"/>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Automated Monthly Contribution (GMD)</FormLabel>
                    <div className="relative">
                      <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="e.g., 75,000" {...field} className="pl-10"/>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Build Start Date</FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Update Goal
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
