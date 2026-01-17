'use client';

import { useMemo } from 'react';
import {
  useUser,
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, orderBy, doc, Timestamp } from 'firebase/firestore';
import type { VerificationResult } from '@/lib/types';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type FirestoreVerificationResult = Omit<VerificationResult, 'timestamp'> & {
  timestamp: Timestamp;
};

/**
 * A custom hook to manage the Aadhaar verification history for the current user.
 * It handles fetching history from Firestore and adding new verification results.
 */
export function useAadhaarHistory() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Memoize the Firestore query to prevent re-creating it on every render.
  // This is crucial for performance and to avoid infinite loops with useCollection.
  const historyQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'aadhaarVerifications'),
      orderBy('timestamp', 'desc')
    );
  }, [user, firestore]);

  // useCollection subscribes to the query and provides real-time updates.
  const {
    data: rawHistory,
    isLoading,
    error,
  } = useCollection<FirestoreVerificationResult>(historyQuery);

  // Memoize the processed history to convert Firestore Timestamps to JS Date objects.
  const history = useMemo(() => {
    if (!rawHistory) return [];
    return rawHistory.map((item) => ({
      ...item,
      timestamp: item.timestamp.toDate(),
    }));
  }, [rawHistory]);

  /**
   * Adds a new verification result to the user's history in Firestore.
   * @param result - The verification result to add. The 'id' and 'timestamp' are part of this object.
   */
  const addVerification = (result: Omit<VerificationResult, 'userId'>) => {
    if (!user) {
      console.error('Cannot add verification: user is not authenticated.');
      return;
    }

    const docRef = doc(
      firestore,
      'users',
      user.uid,
      'aadhaarVerifications',
      result.id
    );

    const newRecord: VerificationResult = {
      ...result,
      userId: user.uid,
    };

    // Use a non-blocking write to update Firestore without waiting for the operation to complete.
    // This keeps the UI responsive.
    setDocumentNonBlocking(docRef, newRecord, { merge: true });
  };

  return { history, isLoading, error, addVerification };
}
