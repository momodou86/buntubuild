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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, ServerCrash, DollarSign, BrainCircuit } from 'lucide-react';
import { getAISuggestion } from '@/app/actions';
import { useState } from 'react';
import type { SuggestOptimalContributionOutput } from '@/ai/flows/suggest-optimal-contributions';
import { useToast } from '@/hooks/use-toast';

const advisorSchema = z.object({
  monthlyIncome: z.coerce
    .number()
    .min(5000, 'Monthly income must be realistic.'),
});

type AdvisorFormData = z.infer<typeof advisorSchema>;

interface AiAdvisorProps {
  savingsGoal: number;
  currentSavings: number;
  targetDate?: Date;
}

export const AiAdvisor: FC<AiAdvisorProps> = ({
  savingsGoal,
  currentSavings,
  targetDate,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] =
    useState<SuggestOptimalContributionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AdvisorFormData>({
    resolver: zodResolver(advisorSchema),
  });

  const onSubmit = async (data: AdvisorFormData) => {
    if (!targetDate) {
      toast({
        title: 'Target Date Required',
        description:
          'Please set a target build date before using the AI Advisor.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    const result = await getAISuggestion({
      ...data,
      savingsGoal,
      currentSavings,
      targetBuildDate: targetDate.toISOString(),
    });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSuggestion(result.data);
    }
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="font-headline text-xl">
              AI Contribution Advisor
            </CardTitle>
            <CardDescription>Get a personalized recommendation.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Monthly Income (GMD)</FormLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Your take-home pay"
                        {...field}
                        className="pl-10"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Suggest Contribution'
              )}
            </Button>
            {error && (
              <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {suggestion && (
              <Alert className="bg-primary/10 border-primary/20">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">
                  AI Recommendation
                </AlertTitle>
                <AlertDescription className="space-y-2">
                  <p className="font-semibold text-lg">
                    Contribute{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'GMD',
                      maximumFractionDigits: 0,
                    }).format(suggestion.suggestedMonthlyContribution)}{' '}
                    / month
                  </p>
                  <p className="text-sm">{suggestion.reasoning}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};
