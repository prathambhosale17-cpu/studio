'use client';
import { Header } from '@/components/header';
import { IdVerification } from '@/components/id-verification';

export default function FaceMatchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8 animate-fade-in-up">
        <div className="mx-auto w-full max-w-4xl">
          <IdVerification />
        </div>
      </main>
    </div>
  );
}
