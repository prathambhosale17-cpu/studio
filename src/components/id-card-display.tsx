'use client';

import { useRef } from 'react';
import type { IDCard } from '@/lib/types';
import Image from 'next/image';
import { Download, UserSquare } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from './ui/button';

interface IdCardDisplayProps {
  card: IDCard;
}

export function IdCardDisplay({ card }: IdCardDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (cardRef.current === null) {
      return;
    }
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = `${card.name.replace(/\s+/g, '_')}-ID-Card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        console.error('Failed to download ID card image', err);
      });
  };

  return (
    <div className="space-y-2">
      <div
        ref={cardRef}
        className="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden font-sans"
      >
        <div className="bg-primary/10 p-4 flex items-center gap-3">
          <UserSquare className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-primary">Digital Identity Card</h2>
            <p className="text-xs text-primary/80">Issued by ID Card Pro</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-5">
            {/* Left side */}
            <div className="flex flex-col gap-4">
              <div className="relative w-28 h-28 rounded-md overflow-hidden border-2 border-muted shrink-0">
                <Image src={card.photoDataUri} alt={card.name} fill className="object-cover" />
              </div>
            </div>
            {/* Right side */}
            <div className="space-y-2.5 text-sm flex-1">
              <div>
                <p className="text-muted-foreground text-xs">Name</p>
                <p className="font-semibold text-base">{card.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Date of Birth</p>
                <p className="font-medium">{card.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Gender</p>
                <p className="font-medium">{card.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">ID Number (UID)</p>
                <p className="font-mono text-primary font-bold text-base">{card.idNumber}</p>
              </div>
            </div>
             <div className="relative w-24 h-24 shrink-0">
                <Image src={card.qrCodeDataUri} alt="QR Code" fill />
              </div>
          </div>
          <div className="mt-4">
             <p className="text-muted-foreground text-xs">Address</p>
             <p className="font-medium text-sm">{card.address}</p>
          </div>
        </div>
        <div className="bg-muted/50 px-5 py-2 text-xs text-muted-foreground flex justify-between">
          <span>Issued on: {card.createdAt.toLocaleDateString()}</span>
          <span>Not a government-issued ID</span>
        </div>
      </div>
      <Button onClick={handleDownload} variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Download Card
      </Button>
    </div>
  );
}
