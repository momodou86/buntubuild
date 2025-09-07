
'use client';

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
  Info,
  History,
  Download,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const milestones = [
  { name: 'Land Title Verification', completed: true, amount: 250000 },
  { name: 'Foundation Materials', completed: true, amount: 500000 },
  { name: 'Contractor Draw 1', completed: false, amount: 750000 },
  { name: 'Roofing Materials', completed: false, amount: 400000 },
];

const auditLog = [
    { id: 'TXN-A4B1C2', type: 'DEPOSIT', description: 'Monthly Contribution', amount: 75000, date: '2024-07-01' },
    { id: 'TXN-D3E2F1', type: 'RELEASE', description: 'Land Title Verification', amount: -250000, date: '2024-06-20' },
    { id: 'TXN-G9H8I7', type: 'DEPOSIT', description: 'Top-up from Awa Njie', amount: 50000, date: '2024-06-15' },
    { id: 'TXN-J6K5L4', type: 'RELEASE', description: 'Foundation Materials', amount: -500000, date: '2024-06-05' },
    { id: 'TXN-M1N0P9', type: 'DEPOSIT', description: 'Initial Deposit', amount: 1185000, date: '2024-05-01' },
]

export function EscrowAccount() {
  const isLocked = true;
  const { toast } = useToast();

  const handleDownloadStatement = () => {
    toast({
        title: 'Statement Generated',
        description: 'Your transaction statement has been downloaded.',
        className: 'bg-primary text-primary-foreground',
    });
  }

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
            <Label
              htmlFor="withdrawal-lock"
              className="flex items-center gap-2 font-semibold"
            >
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
                    <p className="max-w-xs">
                      Funds are locked until milestones are met. An emergency
                      unlock requires admin review.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <Milestone className="h-5 w-5" />
            <span>Milestone-Based Releases</span>
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
                      milestone.completed
                        ? 'font-semibold'
                        : 'text-muted-foreground'
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
         <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-semibold flex items-center gap-2">
                <History className="h-5 w-5" />
                <span>Transaction Ledger</span>
            </h4>
            <Button variant="outline" size="sm" onClick={handleDownloadStatement}>
                <Download className="mr-2 h-4 w-4" />
                Download Statement
            </Button>
          </div>
           <div className="space-y-3 max-h-48 overflow-y-auto pr-2 rounded-md border p-3">
                {auditLog.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                        <div>
                            <p className="font-medium">{log.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})} &bull; Ref: {log.id}
                            </p>
                        </div>
                        <p className={log.amount > 0 ? 'text-primary font-semibold' : 'text-destructive font-semibold'}>
                          {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString()}
                        </p>
                    </div>
                ))}
           </div>
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

    