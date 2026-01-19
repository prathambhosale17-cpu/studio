'use client';
import { useState } from 'react';
import { VerificationForm } from '@/components/verification-form';
import { VerificationHistory } from '@/components/verification-history';
import { VerificationResult } from '@/components/verification-result';
import { Header } from '@/components/header';
import { useAadhaarHistory } from '@/hooks/use-aadhaar-history';
import type { DataMatchResult, IDCard, VerificationResult as VerificationResultType, VerificationStatus } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
    let isDataMatchSuccess = true;
    let dataMatchFailureReason = "";
    
    // Perform Data Match if Aadhaar number was extracted
    if (ocrResult.aadhaarNumber) {
        try {
            // The OCR may include spaces, but the lookup ID does not have them.
            const lookupDocRef = doc(firestore, 'aadhaarLookups', ocrResult.aadhaarNumber.replace(/\s/g, ''));
            const lookupSnapshot = await getDoc(lookupDocRef);

            if (!lookupSnapshot.exists()) {
                dataMatchResult = { status: 'not_found' };
                isDataMatchSuccess = false;
                dataMatchFailureReason = "Data Match Failure (Potential Fraud): No ID card with this Aadhaar number exists in the database.";
            } else {
                const cardPath = lookupSnapshot.data().cardPath;
                const cardDocRef = doc(firestore, cardPath);
                const cardSnapshot = await getDoc(cardDocRef);

                if (!cardSnapshot.exists()) {
                    dataMatchResult = { status: 'not_found' }; // This case is a dangling pointer
                    isDataMatchSuccess = false;
                    dataMatchFailureReason = "Database Error (Potential Fraud): An ID card record was found, but the full card details could not be retrieved. This may indicate a data integrity issue.";
                } else {
                    const dbCard = cardSnapshot.data() as IDCard;
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
                        isDataMatchSuccess = false;
                        const mismatchedFieldNames = mismatchedFields.map(f => f.field).join(', ');
                        dataMatchFailureReason = `Data Mismatch (Potential Fraud): The following information on the card does not match the official database record: ${mismatchedFieldNames}.`;
                    } else {
                        dataMatchResult = { status: 'matched' };
                        isDataMatchSuccess = true;
                    }
                }
            }
        } catch (e) {
            console.error("Data match error:", e);
            dataMatchResult = { status: 'error' };
            isDataMatchSuccess = false;
            dataMatchFailureReason = "Database Error: An unexpected error occurred while verifying data against the database.";
        }
    } else {
        dataMatchResult = { status: 'not_found' };
        isDataMatchSuccess = false;
        dataMatchFailureReason = "OCR Failure: The Aadhaar number could not be read from the card image, so a database match could not be performed.";
    }

    const isOcrSuccess = ocrResult.status === 'verified';
    const finalStatus: VerificationStatus = (isOcrSuccess && isDataMatchSuccess) ? 'verified' : 'failed';
    
    let finalIndicators = ocrResult.indicators;
    if (!isDataMatchSuccess) {
        if (finalIndicators && finalIndicators.toLowerCase().trim() !== 'no fraud indicators found.' && finalIndicators.trim() !== '') {
            finalIndicators = `${dataMatchFailureReason}\n\n${finalIndicators}`;
        } else {
            finalIndicators = dataMatchFailureReason;
        }
    }

    const finalResult: VerificationResultType = {
        ...ocrResult,
        status: finalStatus,
        indicators: finalIndicators,
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
