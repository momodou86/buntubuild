'use client';

import type { FC } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { DollarSign, Trash2, PlusCircle, RefreshCw, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const goalItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Goal name is required.'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
});

const goalSchema = z.object({
  goals: z.array(goalItemSchema),
  monthlyContribution: z.coerce
    .number()
    .min(1000, 'Monthly contribution must be at least 1,000.'),
  targetDate: z.date().optional(),
});

export type Goal = z.infer<typeof goalItemSchema>;
type GoalFormData = z.infer<typeof goalSchema>;

interface GoalSettingsProps {
  goals: Goal[];
  monthlyContribution: number;
  targetDate?: Date;
  onUpdate: (data: GoalFormData) => void;
}

const goalTemplates = [
  {
    name: 'Standard 3-Bedroom Build',
    goals: [
      { id: 'land', name: 'Land Purchase & Docs', amount: 750000 },
      { id: 'foundation', name: 'Foundation & Substructure', amount: 500000 },
      { id: 'structure', name: 'Superstructure (Blockwork to Roof)', amount: 850000 },
      { id: 'finishing', name: 'Finishing (Plastering, Electrical, Plumbing)', amount: 400000 },
      { id: 'fixtures', name: 'Fixtures & Fittings', amount: 300000 },
    ],
  },
  {
    name: 'Basic 2-Bedroom Build',
    goals: [
      { id: 'land', name: 'Land Purchase & Docs', amount: 600000 },
      { id: 'foundation', name: 'Foundation', amount: 350000 },
      { id: 'structure', name: 'Structure to Roof', amount: 600000 },
      { id: 'finishing', name: 'Finishing', amount: 250000 },
    ],
  },
  {
    name: 'Start from Scratch',
    goals: [{ id: 'custom1', name: 'My First Goal', amount: 100000 }],
  },
];


export const GoalSettings: FC<GoalSettingsProps> = ({
  goals,
  monthlyContribution,
  targetDate,
  onUpdate,
}) => {
  const { toast } = useToast();
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goals,
      monthlyContribution,
      targetDate,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'goals',
  });
  
  const totalGoal = form.watch('goals').reduce((sum, goal) => sum + (goal.amount || 0), 0);

  const onSubmit = (data: GoalFormData) => {
    onUpdate(data);
    toast({
      title: 'Goal Updated',
      description: 'Your savings plan has been successfully updated.',
      className: 'bg-primary text-primary-foreground',
    });
  };

  const applyTemplate = (templateGoals: Goal[]) => {
    replace(templateGoals);
  }

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Plan Your Build</CardTitle>
        <CardDescription>
          Break down your project into manageable goals, or start with a template.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <div>
              <FormLabel className="flex items-center gap-2 mb-2">
                <Layers className="h-5 w-5" />
                <span>Goal Templates</span>
              </FormLabel>
              <div className="flex flex-wrap gap-2">
                {goalTemplates.map(template => (
                  <Button
                    type="button"
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template.goals)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <FormLabel>Project Cost Breakdown</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`goals.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="e.g., Foundation" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`goals.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="w-48">
                        <div className="relative">
                           <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <FormControl>
                              <Input type="number" placeholder="Amount" {...field} className="pl-10" />
                           </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className={cn(fields.length <= 1 && "invisible")}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ id: `new${fields.length}`, name: '', amount: 0 })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
               <div className="flex justify-end items-center gap-4 pt-4 border-t">
                  <span className="text-lg font-semibold">Total Savings Goal:</span>
                  <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GMD', maximumFractionDigits: 0 }).format(totalGoal)}
                  </span>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
            </div>
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
