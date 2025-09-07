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
  Shield,
  FileText,
  Landmark,
  Milestone,
  CheckCircle2,
  Circle,
  Lock,
  Info
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const milestones = [
  { name: 'Land Title Verification', completed: true, amount: 250000 },
  { name: 'Foundation Materials', completed: true, amount: 500000 },
  { name: 'Contractor Draw 1', completed: false, amount: 750000 },
  { name: 'Roofing Materials', completed: false, amount: 400000 },
];

export function EscrowAccount() {
  const escrowTotal = milestones
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.amount, 0);
  const isLocked = true;

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="font-headline text-xl">
              Escrow Wallet
            </CardTitle>
            <CardDescription>
              Your funds are secured and released based on project milestones.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <p className="text-sm text-muted-foreground">Linked Property</p>
            <p className="font-semibold">Plot ID: BDA-24-04-A18</p>
          </div>
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
                <Label htmlFor="withdrawal-lock" className="flex items-center gap-2 font-semibold">
                    <Lock className="h-5 w-5" />
                    <span>Withdrawal Lock</span>
                </Label>
                <div className="flex items-center gap-2">
                    <Switch id="withdrawal-lock" checked={isLocked} aria-readonly />
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">Funds are locked until milestones are met. An emergency unlock requires admin review.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
        
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
            <Milestone className="h-5 w-5" />
            <span>Milestone-Based Release</span>
          </h4>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4">
                <div>
                  {milestone.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={
                      milestone.completed ? 'font-semibold' : 'text-muted-foreground'
                    }
                  >
                    {milestone.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    GMD {milestone.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
         <div className="flex items-center justify-between">
            <p className="font-semibold">Total in Escrow:</p>
            <p className="font-bold text-xl text-primary">
              GMD {escrowTotal.toLocaleString()}
            </p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-4 border-t">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Landmark className="h-5 w-5" />
          <span>
            Partnered with{' '}
            <strong className="text-foreground">SecureBank Gambia Ltd.</strong>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
