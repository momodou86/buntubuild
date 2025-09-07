
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
  Upload,
  Paperclip,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import type { Currency } from './dashboard';
import type { FC } from 'react';


const milestones = [
  { name: 'Land Title Verification', completed: true, amount: 250000 },
  { name: 'Foundation Materials', completed: true, amount: 500000 },
  { name: 'Contractor Draw 1', completed: false, amount: 750000, ready: true },
  { name: 'Roofing Materials', completed: false, amount: 400000, ready: false },
];

const auditLog = [
    { id: 'TXN-A4B1C2', type: 'DEPOSIT', description: 'Monthly Contribution', amount: 75000, date: '2024-07-01' },
    { id: 'TXN-D3E2F1', type: 'RELEASE', description: 'Land Title Verification', amount: -250000, date: '2024-06-20' },
    { id: 'TXN-G9H8I7', type: 'DEPOSIT', description: 'Top-up from Awa Njie', amount: 50000, date: '2024-06-15' },
    { id: 'TXN-J6K5L4', type: 'RELEASE', description: 'Foundation Materials', amount: -500000, date: '2024-06-05' },
    { id: 'TXN-M1N0P9', type: 'DEPOSIT', description: 'Initial Deposit', amount: 1185000, date: '2024-05-01' },
]

interface EscrowAccountProps {
  currency: Currency;
}


export const EscrowAccount: FC<EscrowAccountProps> = ({ currency }) => {
  const isLocked = true;
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadStatement = () => {
    toast({
        title: 'Statement Generated',
        description: 'Your transaction statement has been downloaded.',
        className: 'bg-primary text-primary-foreground',
    });
  }

  const handleReleaseRequest = (milestoneName: string) => {
     toast({
        title: 'Release Request Submitted',
        description: `Verification documents for "${milestoneName}" have been submitted for review.`,
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
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4 p-2 rounded-lg even:bg-muted/30">
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
                    {formatCurrency(milestone.amount)}
                  </p>
                </div>
                 {!milestone.completed && (
                   <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" disabled={!milestone.ready}>Request Release</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Fund Release: {milestone.name}</DialogTitle>
                            <DialogDescription>
                                To release {formatCurrency(milestone.amount)}, please upload verification documents (e.g., invoices, photos).
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center text-center">
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="font-semibold">Click or drag files to upload</p>
                                <p className="text-sm text-muted-foreground">Max file size: 5MB per file</p>
                            </div>
                             <div className="space-y-2">
                                <Label>Attached Files:</Label>
                                <div className="flex items-center justify-between p-2 text-sm bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="h-4 w-4" />
                                        <span>contractor_invoice_q3.pdf</span>
                                    </div>
                                    <span className="text-muted-foreground">1.2 MB</span>
                                </div>
                                <div className="flex items-center justify-between p-2 text-sm bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="h-4 w-4" />
                                        <span>foundation_photo_1.jpg</span>
                                    </div>
                                    <span className="text-muted-foreground">2.8 MB</span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button onClick={() => handleReleaseRequest(milestone.name)}>Submit for Review</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                   </Dialog>
                )}
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
                          {log.amount > 0 ? '+' : ''}{formatCurrency(log.amount)}
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
