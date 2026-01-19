'use client';
import { useState } from 'react';
import { VerificationForm } from '@/components/verification-form';
import { VerificationHistory } from '@/components/verification-history';
import { VerificationResult } from '@/components/verification-result';
import { Header } from '@/components/header';
import { useAadhaarHistory } from '@/hooks/use-aadhaar-history';
import type { VerificationResult as VerificationResultType } from '@/lib/types';

export default function AadhaarCheckPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeResult, setActiveResult] = useState<VerificationResultType | null>(null);
  const { history, isLoading: isHistoryLoading, addVerification } = useAadhaarHistory();

  const handleVerificationStart = (imageDataUri: string) => {
    setActiveResult({
      id: 'pending',
      timestamp: new Date(),
      imageDataUri,
      status: 'pending',
      indicators: null,
    });
    setIsVerifying(true);
  };

  const handleVerificationComplete = (result: VerificationResultType) => {
    addVerification(result);
    setActiveResult(result);
    setIsVerifying(false);
  };

  const handleSelectHistoryItem = (item: VerificationResultType) => {
    setActiveResult(item);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <VerificationForm
              onVerificationStart={handleVerificationStart}
              onVerificationComplete={handleVerificationComplete}
              isVerifying={isVerifying}
            />
            <VerificationResult result={activeResult} isVerifying={isVerifying} />
          </div>
          <div className="lg:col-span-1">
            <VerificationHistory
              history={history}
              isLoading={isHistoryLoading}
              onSelectHistoryItem={handleSelectHistoryItem}
              selectedId={activeResult?.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
