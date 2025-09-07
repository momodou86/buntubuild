'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '../logo';
import { Progress } from '../ui/progress';
import { User, Lock, Mail, Globe, MoveRight, MoveLeft, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const step1Schema = z.object({
  fullName: z.string().min(3, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  countryOfResidence: z.string().min(1, 'Please select your country.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const step2Schema = z.object({
  idType: z.string().min(1, 'Please select an ID type.'),
  idNumber: z.string().min(3, 'A valid ID number is required.'),
});

const step3Schema = z.object({
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy.',
  }),
});

const combinedSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type SignUpFormData = z.infer<typeof combinedSchema>;

const steps = [
  {
    title: 'Create Your Account',
    description: 'Start your journey to building your dream home.',
    schema: step1Schema,
  },
  {
    title: 'Verify Your Identity (KYC)',
    description: 'We need to verify your identity to secure your account.',
    schema: step2Schema,
  },
  {
    title: 'Agreements',
    description: 'Please review and accept our terms and policies.',
    schema: step3Schema,
  },
  {
    title: 'Facial Verification',
    description: 'Please take a selfie to complete the verification.',
  },
];

export function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(steps[currentStep]?.schema || z.object({})),
    defaultValues: {
      fullName: '',
      email: '',
      countryOfResidence: '',
      password: '',
      idType: '',
      idNumber: '',
      terms: false,
      privacy: false,
    },
    mode: 'onChange',
  });

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: SignUpFormData) => {
    console.log('Form Submitted', data);
    toast({
        title: 'Account Creation Successful!',
        description: 'Welcome to BuntuBuild. Redirecting you to your dashboard.',
        className: 'bg-primary text-primary-foreground',
      });
    router.push('/dashboard');
  };

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="e.g., Awa Njie" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="you@example.com" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="countryOfResidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country of Residence</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                       <SelectItem value="es">Spain</SelectItem>
                       <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        case 1:
            return (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="national_id">National ID Card</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your document number" {...field} />
                      </FormControl>
                       <FormDescription>
                        Please ensure this matches your document exactly.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Card className="bg-muted/50 border-dashed">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <Camera className="h-10 w-10 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Upload Your ID</h3>
                            <p className="text-sm text-muted-foreground">Drag & drop or click to upload a clear picture of your ID document.</p>
                            <Button type="button" variant="outline" className="mt-2">Upload Document</Button>
                        </div>
                    </CardContent>
                </Card>
              </div>
            );
          case 2:
            return (
                 <div className="space-y-4">
                    <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            I agree to the <a href="#" className="underline text-primary">Terms and Conditions</a>.
                            </FormLabel>
                            <FormDescription>
                            This includes our service terms, fees, and escrow agreement.
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            I agree to the <a href="#" className="underline text-primary">Privacy Policy</a>.
                            </FormLabel>
                             <FormDescription>
                                We are committed to protecting your data.
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                    />
              </div>
            )
        case 3:
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                 <div className="relative w-full max-w-xs aspect-square rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                    <Camera className="h-16 w-16 text-muted-foreground/50" />
                    <p className="absolute bottom-4 text-sm text-muted-foreground px-4">Frame your face in the oval and hold still.</p>
                 </div>
                 <Button type="button">
                    <Camera className="mr-2" />
                    Take Selfie
                </Button>
            </div>
        )
      default:
        return null;
    }
  };


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
                {renderStepContent()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <MoveLeft className="mr-2" />
                Back
              </Button>

              {currentStep < steps.length -1 ? (
                 <Button type="button" onClick={nextStep}>
                    Next
                    <MoveRight className="ml-2" />
                </Button>
              ) : (
                <Button type="submit">Finish Setup</Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
