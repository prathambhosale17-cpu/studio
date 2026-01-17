'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { extractFraudIndicators } from '@/ai/flows/extract-fraud-indicators';
import type { VerificationResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  aadhaarData: z.string().min(10, {
    message: 'Aadhaar data must be at least 10 characters.',
  }),
});

const sampleData = {
  clean:
    'Name: Ramesh Kumar, DOB: 15/08/1985, Gender: Male, Address: 123, Bapu Nagar, Jaipur, Rajasthan, 302015. Biometric hash matches photo hash. Document checksum verified.',
  fraud:
    'Name: Suresh Mehta, DOB: 01/01/1990, Gender: Male, Address: 456, Malviya Nagar, New Delhi, 110017. Critical Alert: Mismatched photo hash and biometric data. Address appears on known fraudulent list. Document issue date seems tampered.',
};

interface VerificationFormProps {
  onVerificationStart: () => void;
  onVerificationComplete: (result: VerificationResult) => void;
  isVerifying: boolean;
}

export function VerificationForm({
  onVerificationStart,
  onVerificationComplete,
  isVerifying,
}: VerificationFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aadhaarData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onVerificationStart();
    try {
      const aiResult = await extractFraudIndicators({ aadhaarData: values.aadhaarData });
      const hasIndicators = aiResult.fraudIndicators && aiResult.fraudIndicators.toLowerCase().trim() !== 'no fraud indicators found.' && aiResult.fraudIndicators.trim() !== '';

      const result: VerificationResult = {
        id: new Date().toISOString(),
        timestamp: new Date(),
        aadhaarData: values.aadhaarData,
        status: hasIndicators ? 'failed' : 'verified',
        indicators: hasIndicators ? aiResult.fraudIndicators : null,
      };
      onVerificationComplete(result);
    } catch (error) {
      console.error('Verification Error:', error);
      const errorResult: VerificationResult = {
        id: new Date().toISOString(),
        timestamp: new Date(),
        aadhaarData: values.aadhaarData,
        status: 'error',
        indicators: 'An unexpected error occurred during AI analysis.',
      };
      onVerificationComplete(errorResult);
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Could not connect to the AI service. Please try again later.',
      });
    }
  }

  const handleSampleData = (type: 'clean' | 'fraud') => {
    form.setValue('aadhaarData', sampleData[type], { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aadhaar Verification</CardTitle>
        <CardDescription>
          Simulate an Aadhaar scan by pasting the document text below. Use the
          sample buttons for a quick demo.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="aadhaarData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Aadhaar Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Name: John Doe, DOB: 01/01/1990, Address: 123 Main St..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleSampleData('clean')}>
                Use Clean Sample
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleSampleData('fraud')}>
                Use Fraudulent Sample
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isVerifying} className="w-full sm:w-auto">
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Aadhaar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
