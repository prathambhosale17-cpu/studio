'use client';

import { useRef } from 'react';
import type { IDCard } from '@/lib/types';
import Image from 'next/image';
import { Download, Trash2, UserSquare } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

interface IdCardDisplayProps {
  card: IDCard;
  onDelete?: (cardId: string) => void;
}

export function IdCardDisplay({ card, onDelete }: IdCardDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = () => {
    if (cardRef.current === null) {
      return;
    }
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = `${card.idNumber}-ID-Card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        console.error('Failed to download ID card image', err);
        toast({
            variant: "destructive",
            title: "Download failed",
            description: "Could not generate image for download."
        })
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
            <p className="text-xs text-primary/80">Issued by AI-Based Identity Verification & Smart Government Scheme Platform</p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-3 gap-5 items-start">
          {/* Left Column: Photo & QR */}
          <div className="col-span-1 flex flex-col items-center gap-4 pt-2">
            <div className="relative w-28 h-32 rounded-md overflow-hidden border-2 border-muted shrink-0">
              <Image src={card.photoDataUri} alt={card.name} fill className="object-cover" />
            </div>
            <div className="relative w-24 h-24">
              <Image src={card.qrCodeDataUri} alt="QR Code" fill />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="col-span-2 space-y-3.5 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="font-semibold text-lg">{card.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">ID Number (UID)</p>
              <p className="font-mono text-primary font-bold text-base">{card.idNumber}</p>
            </div>
            {card.aadhaarNumber && (
              <div>
                <p className="text-muted-foreground text-xs">Aadhaar Number</p>
                <p className="font-mono text-base">{card.aadhaarNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Date of Birth</p>
                <p className="font-medium">{card.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Gender</p>
                <p className="font-medium">{card.gender}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Address</p>
              <p className="font-medium text-sm leading-snug">{card.address}</p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 px-5 py-2 text-xs text-muted-foreground flex justify-between">
          <span>Issued on: {card.createdAt.toLocaleDateString()}</span>
          <span>Not a government-issued ID</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Card
        </Button>
        {onDelete && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Card
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the ID card for {card.name}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(card.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
      </div>
    </div>
  );
}
