'use client';

import type { IDCard } from '@/lib/types';
import Image from 'next/image';
import { UserSquare } from 'lucide-react';

interface IdCardDisplayProps {
  card: IDCard;
}

export function IdCardDisplay({ card }: IdCardDisplayProps) {
  return (
    <div className="w-full max-w-sm rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden font-sans">
      <div className="bg-primary/10 p-4 flex items-center gap-3">
        <UserSquare className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-primary">Digital Identity Card</h2>
          <p className="text-xs text-primary/80">Issued by ID Card Pro</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-5">
          <div className="relative w-24 h-24 rounded-md overflow-hidden border-2 border-muted shrink-0">
            <Image
              src={card.photoDataUri}
              alt={card.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="font-semibold text-base">{card.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Date of Birth</p>
              <p className="font-medium">{card.dateOfBirth}</p>
            </div>
             <div>
              <p className="text-muted-foreground text-xs">ID Number</p>
              <p className="font-mono text-primary font-bold">{card.idNumber}</p>
            </div>
          </div>
        </div>
      </div>
       <div className="bg-muted/50 px-5 py-2 text-xs text-muted-foreground">
        Issued on: {card.createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}
