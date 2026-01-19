'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collectionGroup, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IdCardDisplay } from '@/components/id-card-display';
import type { IDCard } from '@/lib/types';
import { Loader2, Search, Frown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DownloadCardPage() {
  const [idNumber, setIdNumber] = useState('');
  const [foundCard, setFoundCard] = useState<IDCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const firestore = useFirestore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber.trim()) {
      setError('Please enter an ID number.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFoundCard(null);
    setSearched(true);

    try {
      const q = query(
        collectionGroup(firestore, 'idCards'),
        where('idNumber', '==', idNumber.trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setFoundCard(null);
      } else {
        const cardDoc = querySnapshot.docs[0];
        const cardData = cardDoc.data();
        const card: IDCard = {
            ...cardData,
            id: cardDoc.id,
            createdAt: (cardData.createdAt as Timestamp).toDate(),
        } as IDCard;
        setFoundCard(card);
      }
    } catch (e) {
      console.error('Error searching for ID card:', e);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8 animate-fade-in-up">
        <div className="mx-auto w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Download ID Card</CardTitle>
              <CardDescription>
                Enter the ID Number (UID) from the card to search for and download it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  placeholder="IDC-123456789012"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Search />
                  )}
                  <span className="sr-only">Search</span>
                </Button>
              </form>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Search Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : foundCard ? (
                  <IdCardDisplay card={foundCard} />
                ) : searched ? (
                   <div className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed text-center">
                        <Frown className="h-10 w-10 text-muted-foreground mb-2"/>
                        <p className="text-muted-foreground font-semibold">No ID Card Found</p>
                        <p className="text-sm text-muted-foreground">The ID number you entered does not match any records.</p>
                    </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
