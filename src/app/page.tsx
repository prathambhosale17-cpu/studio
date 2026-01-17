'use client';

import { useState, useEffect } from 'react';
import type { VerificationResult } from '@/lib/types';
import { Header } from '@/components/header';
import { VerificationForm } from '@/components/verification-form';
import { VerificationResult as VerificationResultDisplay } from '@/components/verification-result';
import { VerificationHistory } from '@/components/verification-history';
import { useAadhaarHistory } from '@/hooks/use-aadhaar-history';

export default function Home() {
  const { history, addVerification, isLoading: isHistoryLoading } = useAadhaarHistory();
  const [isVerifying, setIsVerifying] = useState(false);
  const [viewedResult, setViewedResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    // When history loads, if no result is being viewed, select the most recent one.
    if (!viewedResult && !isHistoryLoading && history.length > 0) {
      setViewedResult(history[0]);
    }
  }, [history, isHistoryLoading, viewedResult]);

  const handleVerificationStart = (imageDataUri: string) => {
    setIsVerifying(true);
    const pendingResult: VerificationResult = {
      id: `pending-${Date.now()}`,
      timestamp: new Date(),
      status: 'pending',
      imageDataUri: imageDataUri,
      indicators: null,
    };
    setViewedResult(pendingResult);
  };

  const handleVerificationComplete = (result: VerificationResult) => {
    addVerification(result); // This will save to Firestore
    setViewedResult(result);
    setIsVerifying(false);
  };

  const handleSelectHistoryItem = (item: VerificationResult) => {
    setViewedResult(item);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-2">
            <VerificationForm
              onVerificationStart={handleVerificationStart}
              onVerificationComplete={handleVerificationComplete}
              isVerifying={isVerifying}
            />
            <VerificationResultDisplay result={viewedResult} isVerifying={isVerifying && viewedResult?.status === 'pending'} />
          </div>
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-1">
            <VerificationHistory
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              selectedId={viewedResult?.id}
              isLoading={isHistoryLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
