'use client';

import { useMemo } from 'react';
import {
  useUser,
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, orderBy, doc, Timestamp } from 'firebase/firestore';
import type { IDCard, FirestoreIDCard } from '@/lib/types';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * A custom hook to manage the ID card history for the current user.
 * It handles fetching history from Firestore and adding new ID cards.
 */
export function useIdCards() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Memoize the Firestore query to prevent re-creating it on every render.
  const cardsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'idCards'),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  // useCollection subscribes to the query and provides real-time updates.
  const {
    data: rawCards,
    isLoading,
    error,
  } = useCollection<FirestoreIDCard>(cardsQuery);

  // Memoize the processed history to convert Firestore Timestamps to JS Date objects.
  const cards = useMemo(() => {
    if (!rawCards) return [];
    return rawCards.map((item) => ({
      ...item,
      createdAt: item.createdAt.toDate(),
    }));
  }, [rawCards]);

  /**
   * Adds a new ID card to the user's history in Firestore.
   * @param cardData - The ID card data to add.
   */
  const addIdCard = (cardData: Omit<IDCard, 'userId' | 'createdAt'>) => {
    if (!user) {
      console.error('Cannot add ID card: user is not authenticated.');
      return;
    }

    const docRef = doc(firestore, 'users', user.uid, 'idCards', cardData.id);
    
    // The server expects a Firestore Timestamp, not a JS Date.
    const newRecord: Omit<IDCard, 'createdAt'> & { createdAt: Timestamp } = {
      ...cardData,
      userId: user.uid,
      createdAt: Timestamp.now(),
    };
    
    // Use a non-blocking write for the main document.
    setDocumentNonBlocking(docRef, newRecord, { merge: false });

    // Create the ID Number lookup entry
    const idNumberLookupDocRef = doc(firestore, 'idNumberLookups', newRecord.idNumber);
    setDocumentNonBlocking(idNumberLookupDocRef, { cardPath: docRef.path }, { merge: false });

    // Create the Aadhaar lookup entry if an Aadhaar number is provided
    if (newRecord.aadhaarNumber) {
        const aadhaarLookupDocRef = doc(firestore, 'aadhaarLookups', newRecord.aadhaarNumber);
        setDocumentNonBlocking(aadhaarLookupDocRef, { cardPath: docRef.path }, { merge: false });
    }
  };

  const deleteIdCard = (cardId: string) => {
    if (!user) {
        console.error('Cannot delete ID card: user not authenticated.');
        return;
    }
    const cardToDelete = cards.find(card => card.id === cardId);

    // If we can't find the card in the local state, we can't get the lookup keys.
    // This is a rare edge case, but we can still attempt to delete the main document.
    if (!cardToDelete) {
        console.warn("Could not find card in local state to delete lookups. Deleting main document only.");
        const docRef = doc(firestore, 'users', user.uid, 'idCards', cardId);
        deleteDocumentNonBlocking(docRef);
        return;
    }

    // Delete the ID Number lookup document
    const idNumberLookupDocRef = doc(firestore, 'idNumberLookups', cardToDelete.idNumber);
    deleteDocumentNonBlocking(idNumberLookupDocRef);

    // Delete the Aadhaar lookup document if it exists
    if (cardToDelete.aadhaarNumber) {
        const aadhaarLookupDocRef = doc(firestore, 'aadhaarLookups', cardToDelete.aadhaarNumber);
        deleteDocumentNonBlocking(aadhaarLookupDocRef);
    }

    // Delete the main ID card document
    const docRef = doc(firestore, 'users', user.uid, 'idCards', cardId);
    deleteDocumentNonBlocking(docRef);
  };

  return { cards, isLoading, error, addIdCard, deleteIdCard };
}
