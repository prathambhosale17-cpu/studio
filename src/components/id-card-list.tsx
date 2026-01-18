'use client';
import { useState } from 'react';
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
import { useLanguage } from '@/context/language-context';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface IdCardListProps {
  cards: IDCard[];
  isLoading: boolean;
  deleteIdCard: (cardId: string) => void;
}

export function IdCardList({ cards, isLoading, deleteIdCard }: IdCardListProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = cards.filter(card =>
    card.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('My ID Cards')}</CardTitle>
        <CardDescription>{t('A list of all the digital ID cards you have created.')}</CardDescription>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('Search by ID Number...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-56 w-full rounded-lg" />
            <Skeleton className="h-56 w-full rounded-lg" />
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              {searchTerm
                ? t('No cards found for your search.')
                : t("You haven't created any ID cards yet.")}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredCards.map(card => (
              <IdCardDisplay key={card.id} card={card} onDelete={deleteIdCard} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
