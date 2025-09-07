import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Award, Star, ShieldCheck, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const achievements = [
  { icon: Star, title: 'First Deposit', achieved: true },
  { icon: Target, title: 'Goal Setter', achieved: true },
  { icon: ShieldCheck, title: '3 Months Streak', achieved: true },
  { icon: Award, title: '25% Saved', achieved: true },
  { icon: Trophy, title: '50% Saved', achieved: false },
  { icon: Trophy, title: '75% Saved', achieved: false },
  { icon: Trophy, title: 'Goal Achieved!', achieved: false },
];

export function Achievements() {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="font-headline text-xl">Achievements</CardTitle>
            <CardDescription>Milestones on your journey.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-4 text-center">
            {achievements.map((ach, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <div
                    className={cn(
                      'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
                      ach.achieved
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted/50 text-muted-foreground opacity-50'
                    )}
                  >
                    <ach.icon className="h-8 w-8" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{ach.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
