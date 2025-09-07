import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Users } from 'lucide-react';

const feedItems = [
  {
    name: 'Musa Jawara',
    avatar: 'https://picsum.photos/id/237/40',
    dataAiHint: 'man portrait',
    message: 'Just hit the 50% mark on my BuntuBuild savings! So excited to see the progress. Can anyone recommend good architects in the Kombos?',
    time: '2h ago',
  },
  {
    name: 'Fatima Jallow',
    avatar: 'https://picsum.photos/id/238/40',
    dataAiHint: 'woman portrait',
    message: "Started my savings journey today. It feels good to finally take the first step towards building our family home.",
    time: '1d ago',
  },
];

export function CommunityFeed() {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Users className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="font-headline text-xl">Community Hub</CardTitle>
            <CardDescription>Connect with fellow builders.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedItems.map((item, index) => (
          <div key={index} className="flex gap-3">
            <Avatar>
              <AvatarImage src={item.avatar} alt={item.name} data-ai-hint={item.dataAiHint} />
              <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <p className="text-sm text-muted-foreground">{item.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
