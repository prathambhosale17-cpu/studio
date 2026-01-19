'use client';
import { useState } from 'react';
import { VerificationForm } from '@/components/verification-form';
import { VerificationHistory } from '@/components/verification-history';
import { VerificationResult } from '@/components/verification-result';
import { Header } from '@/components/header';
import { useAadhaarHistory } from '@/hooks/use-aadhaar-history';
import type { DataMatchResult, IDCard, VerificationResult as VerificationResultType } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { collectionGroup, getDocs, query, where } from 'firebase/firestore';

export default function AadhaarCheckPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeResult, setActiveResult] = useState<VerificationResultType | null>(null);
  const { history, isLoading: isHistoryLoading, addVerification } = useAadhaarHistory();
  const firestore = useFirestore();

  const handleVerificationStart = (imageDataUri: string) => {
    setActiveResult({
      id: 'pending',
      timestamp: new Date(),
      imageDataUri,
      status: 'pending',
      indicators: null,
      dataMatch: { status: 'loading' }
    });
    setIsVerifying(true);
  };

  const handleVerificationComplete = async (ocrResult: Omit<VerificationResultType, 'dataMatch'>) => {
    let dataMatchResult: DataMatchResult | null = null;
    
    // Perform Data Match if Aadhaar number was extracted
    if (ocrResult.aadhaarNumber) {
        try {
            const q = query(
                collectionGroup(firestore, 'idCards'),
                where('aadhaarNumber', '==', ocrResult.aadhaarNumber)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                dataMatchResult = { status: 'not_found' };
            } else {
                const dbCard = querySnapshot.docs[0].data() as IDCard;
                const mismatchedFields: { field: string; dbValue: any; ocrValue: any }[] = [];
                
                const normalize = (str: string | null | undefined) => (str || '').trim().toLowerCase();

                if (normalize(ocrResult.name) !== normalize(dbCard.name)) {
                    mismatchedFields.push({ field: 'Name', dbValue: dbCard.name, ocrValue: ocrResult.name });
                }

                let ocrDobFormatted = ocrResult.dateOfBirth; // OCR is DD/MM/YYYY
                if (ocrDobFormatted) {
                    const parts = ocrDobFormatted.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                    if (parts) {
                        ocrDobFormatted = `${parts[3]}-${parts[2]}-${parts[1]}`; // Convert to YYYY-MM-DD
                    }
                }
                if (ocrDobFormatted !== dbCard.dateOfBirth) {
                    mismatchedFields.push({ field: 'Date of Birth', dbValue: dbCard.dateOfBirth, ocrValue: ocrResult.dateOfBirth });
                }

                if (normalize(ocrResult.gender) !== normalize(dbCard.gender)) {
                    mismatchedFields.push({ field: 'Gender', dbValue: dbCard.gender, ocrValue: ocrResult.gender });
                }

                if (mismatchedFields.length > 0) {
                    dataMatchResult = { status: 'mismatched', details: mismatchedFields };
                } else {
                    dataMatchResult = { status: 'matched' };
                }
            }
        } catch (e) {
            console.error("Data match error:", e);
            dataMatchResult = { status: 'error' };
        }
    }

    const finalResult: VerificationResultType = {
        ...ocrResult,
        dataMatch: dataMatchResult
    };

    addVerification(finalResult);
    setActiveResult(finalResult);
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
