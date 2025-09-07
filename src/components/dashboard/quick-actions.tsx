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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { DollarSign, Upload, Users, Send, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

const topUpSchema = z.object({
  amount: z.coerce.number().min(500, 'Top-up must be at least 500.'),
});

type TopUpFormData = z.infer<typeof topUpSchema>;

interface QuickActionsProps {
  onTopUp: (amount: number) => void;
}

const jointMembers = [
    { name: 'Awa Njie', avatar: 'https://picsum.photos/id/239/40', dataAiHint: 'woman portrait', contribution: 75000 },
    { name: 'Lamin Touray', avatar: 'https://picsum.photos/id/240/40', dataAiHint: 'man portrait', contribution: 50000 },
]

export const QuickActions: FC<QuickActionsProps> = ({ onTopUp }) => {
  const { toast } = useToast();
  const form = useForm<TopUpFormData>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: 5000 },
  });

  const onSubmit = (data: TopUpFormData) => {
    onTopUp(data.amount);
    toast({
      title: 'Contribution successful!',
      description: `You've added GMD ${data.amount.toLocaleString()} to your savings.`,
      className: 'bg-primary text-primary-foreground',
    });
    form.reset();
  };

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Send className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="font-headline text-xl">Quick Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Make a Top-up Contribution</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Amount"
                          {...field}
                          className="pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Upload className="mr-2 h-4 w-4" />
                Top-up Now
              </Button>
            </form>
          </Form>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Joint Savings</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Manage Joint Savings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Joint Savings Members</DialogTitle>
                <DialogDescription>
                  Invite and manage family members contributing to this goal.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                    <Label>Current Members</Label>
                    {jointMembers.map(member => (
                        <div key={member.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Total: GMD {member.contribution.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Separator />
                <div className="space-y-3">
                    <Label htmlFor="invite-email">Invite New Member</Label>
                    <div className="flex gap-2">
                        <Input id="invite-email" type="email" placeholder="Enter email address" />
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Invite
                        </Button>
                    </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
