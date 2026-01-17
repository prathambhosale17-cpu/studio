'use client';
import type { IDCard } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IdCardDisplay } from './id-card-display';

interface IdCardListProps {
  cards: IDCard[];
  isLoading: boolean;
}

export function IdCardList({ cards, isLoading }: IdCardListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My ID Cards</CardTitle>
        <CardDescription>A list of all the digital ID cards you have created.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-56 w-full rounded-lg" />
            <Skeleton className="h-56 w-full rounded-lg" />
          </div>
        ) : cards.length === 0 ? (
          <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">You haven't created any ID cards yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {cards.map(card => (
              <IdCardDisplay key={card.id} card={card} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
