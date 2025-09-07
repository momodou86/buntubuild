'use client';

import type { FC } from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ProgressSummaryProps {
  currentSavings: number;
  savingsGoal: number;
  monthlyContribution: number;
  onTrack: boolean;
  targetDate?: Date;
}

const chartConfig = {
  saved: {
    label: 'Saved',
  },
  remaining: {
    label: 'Remaining',
  },
} satisfies ChartConfig;

export const ProgressSummary: FC<ProgressSummaryProps> = ({
  currentSavings,
  savingsGoal,
  monthlyContribution,
  onTrack,
  targetDate,
}) => {
  const progress = Math.min((currentSavings / savingsGoal) * 100, 100);
  const chartData = [
    { name: 'saved', value: currentSavings, fill: 'var(--color-saved)' },
    {
      name: 'remaining',
      value: Math.max(0, savingsGoal - currentSavings),
      fill: 'var(--color-remaining)',
    },
  ];

  const formattedSavings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GMD',
    maximumFractionDigits: 0,
  }).format(currentSavings);

  const formattedGoal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GMD',
    maximumFractionDigits: 0,
  }).format(savingsGoal);

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline text-3xl">Your Savings Goal</CardTitle>
        <CardDescription>
          Your journey to building your dream home.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              strokeWidth={5}
              startAngle={90}
              endAngle={450}
            >
              <Cell
                key="saved"
                fill="hsl(var(--primary))"
                className="transition-colors"
              />
              <Cell
                key="remaining"
                fill="hsl(var(--muted))"
                className="transition-colors"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-4 pb-6">
        <div className="flex items-center justify-center font-bold text-4xl text-primary">
          {progress.toFixed(1)}%
          <span className="text-sm font-medium text-muted-foreground ml-2">
            Complete
          </span>
        </div>
        <div className="w-full text-center text-sm text-muted-foreground">
          <p>
            You have saved{' '}
            <strong className="text-foreground">{formattedSavings}</strong> out
            of your <strong className="text-foreground">{formattedGoal}</strong> goal.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <Badge variant={onTrack ? 'default' : 'destructive'} className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
            {onTrack ? (
              <TrendingUp className="mr-2 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-2 h-4 w-4" />
            )}
            {onTrack ? 'On Track' : 'Needs Attention'}
          </Badge>
          {targetDate && (
            <div className="flex items-center text-muted-foreground">
              <Target className="mr-2 h-4 w-4" />
              <span>Target: {format(targetDate, 'MMMM yyyy')}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
