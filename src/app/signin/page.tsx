
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { SignInForm } from '@/components/signin-form';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function SignInSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your BuntuBuild dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<SignInSkeleton />}>
                <SignInForm />
            </Suspense>
        </CardContent>
         <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
        </CardFooter>
      </Card>
    </div>
  );
}
