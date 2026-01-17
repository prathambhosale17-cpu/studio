'use client';
import { IdCardForm } from '@/components/id-card-form';
import { IdCardList } from '@/components/id-card-list';
import { Header } from '@/components/header';
import { useIdCards } from '@/hooks/use-id-cards';

export default function Home() {
  const { cards, isLoading, addIdCard } = useIdCards();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-1">
            <IdCardForm onAddCard={addIdCard} />
          </div>
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-2">
            <IdCardList cards={cards} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
