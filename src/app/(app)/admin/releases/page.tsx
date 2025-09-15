
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Paperclip, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ReleaseStatus = 'pending' | 'approved' | 'denied';

interface PendingRelease {
  id: string;
  userName: string;
  userAvatar: string;
  dataAiHint: string;
  milestone: string;
  amount: number;
  currency: 'GMD' | 'USD' | 'GBP';
  date: Date;
  status: ReleaseStatus;
  documents: { name: string; url: string }[];
}

const initialReleases: PendingRelease[] = [
  {
    id: 'REL-001',
    userName: 'Musa Jawara',
    userAvatar: 'https://picsum.photos/id/237/40',
    dataAiHint: 'man portrait',
    milestone: 'Contractor Draw 1',
    amount: 750000,
    currency: 'GMD',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: 'pending',
    documents: [
      { name: 'Contractor_Invoice_A1.pdf', url: '#' },
      { name: 'Progress_Photo_1.jpg', url: '#' },
    ],
  },
  {
    id: 'REL-002',
    userName: 'Amina Ceesay',
    userAvatar: 'https://picsum.photos/id/241/40',
    dataAiHint: 'woman portrait',
    milestone: 'Foundation Materials',
    amount: 35000,
    currency: 'USD',
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    status: 'pending',
    documents: [{ name: 'Material_Quote.pdf', url: '#' }],
  },
  {
    id: 'REL-003',
    userName: 'Lamin Touray',
    userAvatar: 'https://picsum.photos/id/240/40',
    dataAiHint: 'man portrait',
    milestone: 'Land Title Verification',
    amount: 5000,
    currency: 'GBP',
    date: new Date(new Date().setDate(new Date().getDate() - 10)),
    status: 'approved',
    documents: [{ name: 'Title_Deed_Scanned.pdf', url: '#' }],
  },
];

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AdminReleasesPage() {
  const { toast } = useToast();
  const [releases, setReleases] = useState<PendingRelease[]>(initialReleases);
  const [selectedRelease, setSelectedRelease] = useState<PendingRelease | null>(null);

  const handleAction = (id: string, newStatus: 'approved' | 'denied') => {
    setReleases(releases.map(r => r.id === id ? { ...r, status: newStatus } : r));
    const release = releases.find(r => r.id === id);
    if(release) {
        toast({
            title: `Release ${newStatus}`,
            description: `The request for "${release.milestone}" has been ${newStatus}.`,
            className: newStatus === 'approved' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground',
        });
    }
  };
  

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pending Releases</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Awaiting Verification</CardTitle>
          <CardDescription>
            Review and approve or deny milestone release requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead className="hidden md:table-cell text-right">Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releases.map((release) => (
                <TableRow key={release.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={release.userAvatar} alt="Avatar" data-ai-hint={release.dataAiHint} />
                        <AvatarFallback>{release.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{release.userName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{release.milestone}</TableCell>
                  <TableCell className="hidden md:table-cell text-right font-mono">
                    {formatCurrency(release.amount, release.currency)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {release.date.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={release.status === 'pending' ? 'secondary' : release.status === 'approved' ? 'default' : 'destructive'}>
                      {release.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {release.status === 'pending' ? (
                      <Dialog onOpenChange={(open) => !open && setSelectedRelease(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedRelease(release)}>
                            Review
                          </Button>
                        </DialogTrigger>
                        {selectedRelease && selectedRelease.id === release.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Request: {selectedRelease.milestone}</DialogTitle>
                            <DialogDescription>
                              From {selectedRelease.userName} for {formatCurrency(selectedRelease.amount, selectedRelease.currency)}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <h4 className="font-semibold">Submitted Documents</h4>
                            <ul className="space-y-2">
                                {selectedRelease.documents.map(doc => (
                                    <li key={doc.name}>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                            <Paperclip className="h-4 w-4" />
                                            <span>{doc.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                          </div>
                          <DialogFooter>
                             <DialogClose asChild>
                                <Button variant="destructive" onClick={() => handleAction(selectedRelease.id, 'denied')}>
                                  <XCircle className="mr-2 h-4 w-4"/>
                                  Deny
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button className="bg-primary hover:bg-primary/90" onClick={() => handleAction(selectedRelease.id, 'approved')}>
                                   <CheckCircle className="mr-2 h-4 w-4"/>
                                   Approve
                                </Button>
                              </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                        )}
                      </Dialog>
                    ) : (
                      <span className="text-sm text-muted-foreground">Completed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
