import { Suspense } from 'react';
import { SignIn } from "@/components/onboarding/sign-in";

function SignInComponent() {
  return (
    <main>
      <SignIn />
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInComponent />
    </Suspense>
  );
}
