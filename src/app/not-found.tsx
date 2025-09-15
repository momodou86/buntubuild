import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <div className="mx-auto bg-destructive/20 p-4 rounded-full">
             <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
           <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription>
            Sorry, the page you are looking for does not exist or has been moved.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
