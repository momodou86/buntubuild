import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="items-center">
           <div className="p-4 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
           </div>
        </CardHeader>
        <CardContent className="space-y-2">
           <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription>
            Oops! The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
            </Link>
          </Button>
           <Button asChild variant="outline" className="w-full">
            <Link href="/">
                Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
