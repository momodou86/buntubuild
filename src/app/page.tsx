'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Logo } from '@/components/logo';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MoveRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

import { Step1Account, step1Schema } from '@/components/signup/step1-account';
import { Step2Identity, step2Schema } from '@/components/signup/step2-identity';
import { Step3Agreements, step3Schema } from '@/components/signup/step3-agreements';
import { Step4FacialVerification } from '@/components/signup/step4-facial-verification';

const combinedSchema = step1Schema.merge(step2Schema).merge(step3Schema);
export type SignUpFormData = z.infer<typeof combinedSchema>;


const steps = [
  {
    title: 'Create Your Account',
    description: 'Start your journey to building your dream home.',
    schema: step1Schema,
    component: Step1Account,
  },
  {
    title: 'Verify Your Identity (KYC)',
    description: 'We need to verify your identity to secure your account.',
    schema: step2Schema,
    component: Step2Identity,
  },
  {
    title: 'Agreements',
    description: 'Please review and accept our terms and policies.',
    schema: step3Schema,
    component: Step3Agreements,
  },
  {
    title: 'Facial Verification',
    description: 'Please take a selfie to complete the verification.',
    component: Step4FacialVerification,
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      fullName: '',
      email: '',
      countryOfResidence: '',
      password: '',
      idType: '',
      idNumber: '',
      idDocument: undefined,
      terms: false,
      privacy: false,
    },
    mode: 'onChange',
  });

  const nextStep = async () => {
    const schemaForStep = steps[currentStep]?.schema;
    if (schemaForStep) {
      const fieldsToValidate = Object.keys(
        schemaForStep.shape
      ) as (keyof SignUpFormData)[];
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (currentStep === 2) {
      // Trigger submission before moving to the final step
      await form.handleSubmit(onSubmit)();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    try {
      await signUp(data.email, data.password, data.fullName);
      console.log('Form Submitted', data);
      
      // Only show toast and move to next step on success of step 3 submission
      toast({
        title: 'Account Details Submitted!',
        description: 'Just one more step to verify your identity.',
        className: 'bg-primary text-primary-foreground',
      });
      setCurrentStep((prev) => prev + 1);

    } catch (err: any) {
      let message = 'An unexpected error occurred. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email address is already in use. Please try another one.';
      } else {
        message = err.message || message;
      }
      setError(message);
      setCurrentStep(0); // Go back to first step on error
    }
  };

  const onFinalSubmit = () => {
     toast({
        title: 'Account Creation Successful!',
        description: 'Welcome to BuntuBuild. Redirecting you to your dashboard.',
        className: 'bg-primary text-primary-foreground',
      });
    router.push('/dashboard');
  }

  const progress = ((currentStep + 1) / (steps.length)) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="mx-auto mb-4">
                <Logo />
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-center pt-4">
                <CardTitle className="text-2xl font-headline">
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep].description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="min-h-[350px]">
              {error && currentStep === 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Sign-up Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentStepComponent form={form} onFinalSubmit={onFinalSubmit} />
                </motion.div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div>
                {currentStep === 0 && (
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-primary hover:underline">
                      Sign In
                    </Link>
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 w-full">
                {currentStep > 0 && currentStep < steps.length - 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={form.formState.isSubmitting}
                  >
                    <MoveLeft className="mr-2" />
                    Back
                  </Button>
                )}

                {currentStep < steps.length - 2 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <MoveRight className="ml-2" />
                  </Button>
                ) : currentStep === 2 ? (
                   <Button type="button" onClick={nextStep} disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Submitting...' : 'Submit & Continue'}
                      <MoveRight className="ml-2" />
                  </Button>
                ) : null}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
