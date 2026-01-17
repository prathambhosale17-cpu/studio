'use client';

import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { VerificationResult, VerificationStatus } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface VerificationResultProps {
  result: VerificationResult | null;
  isVerifying: boolean;
}

const statusConfig: Record<
  VerificationStatus,
  {
    Icon: React.ElementType;
    title: string;
    description: string;
    badgeVariant: 'default' | 'destructive' | 'secondary' | 'outline';
    badgeText: string;
    iconColor: string;
  }
> = {
  idle: {
    Icon: HelpCircle,
    title: 'Ready to Verify',
    description: 'Submit an Aadhaar image to begin the verification process.',
    badgeVariant: 'secondary',
    badgeText: 'Idle',
    iconColor: 'text-muted-foreground',
  },
  pending: {
    Icon: Loader2,
    title: 'Verifying...',
    description: 'AI is analyzing the provided Aadhaar image. Please wait.',
    badgeVariant: 'outline',
    badgeText: 'Pending',
    iconColor: 'text-primary animate-spin',
  },
  verified: {
    Icon: CheckCircle2,
    title: 'Verified Successfully',
    description: 'No fraud indicators were found in the Aadhaar image.',
    badgeVariant: 'default',
    badgeText: 'Verified',
    iconColor: 'text-accent',
  },
  failed: {
    Icon: XCircle,
    title: 'Potential Fraud Detected',
    description: 'The AI analysis has identified potential inconsistencies or risks.',
    badgeVariant: 'destructive',
    badgeText: 'Failed',
    iconColor: 'text-destructive',
  },
  error: {
    Icon: AlertCircle,
    title: 'Verification Error',
    description: 'An unexpected error occurred. Please try again.',
    badgeVariant: 'destructive',
    badgeText: 'Error',
    iconColor: 'text-destructive',
  },
};

const DataItem = ({ label, value, isFullWidth = false }: { label: string, value?: string, isFullWidth?: boolean }) => {
    if (!value) return null;
    return (
        <div className={cn("grid grid-cols-2", isFullWidth ? "col-span-2" : "col-span-1")}>
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="text-foreground text-right">{value}</p>
        </div>
    )
}

export function VerificationResult({ result, isVerifying }: VerificationResultProps) {
  const status = isVerifying ? 'pending' : result?.status ?? 'idle';
  const config = statusConfig[status];
  const showExtractedData = result && (status === 'verified' || status === 'failed');

  return (
    <Card className="min-h-[300px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verification Result</CardTitle>
            <CardDescription>The outcome of the AI-powered analysis.</CardDescription>
          </div>
          <Badge variant={config.badgeVariant} className="capitalize">{config.badgeText}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result?.imageDataUri && (
          <div className="relative rounded-md overflow-hidden border">
            <Image
              src={result.imageDataUri}
              alt="Analyzed Aadhaar card"
              width={400}
              height={250}
              className="w-full h-auto object-contain bg-muted/20"
            />
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center bg-muted/50 rounded-lg">
          <config.Icon className={`h-12 w-12 ${config.iconColor}`} />
          <h3 className="text-xl font-bold mt-2">{config.title}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        {showExtractedData && (
          <div className="space-y-4 rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-foreground">Extracted Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DataItem label="Name" value={result.name} />
                <DataItem label="Date of Birth" value={result.dateOfBirth} />
                <DataItem label="Gender" value={result.gender} />
                <DataItem label="Aadhaar No." value={result.aadhaarNumber} />
                {result.address && <>
                    <div className="md:col-span-2 -my-1">
                        <Separator/>
                    </div>
                    <div className="md:col-span-2">
                        <p className="font-medium text-muted-foreground mb-1">Address</p>
                        <p className="text-foreground text-sm">{result.address}</p>
                    </div>
                </>}
            </div>
          </div>
        )}

        {(status === 'failed' || status === 'error') && result?.indicators && (
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">
              {status === 'failed' ? 'Fraud Indicators' : 'Error Details'}
            </h4>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {status === 'failed' ? 'Potential Issues Found' : 'System Error'}
              </AlertTitle>
              <AlertDescription className="prose prose-sm dark:prose-invert">
                {result.indicators}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
