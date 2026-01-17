'use client';

import { useState } from 'react';
import { Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { extractFraudIndicators } from '@/ai/flows/extract-fraud-indicators';
import type { VerificationResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VerificationFormProps {
  onVerificationStart: (imageDataUri: string) => void;
  onVerificationComplete: (result: VerificationResult) => void;
  isVerifying: boolean;
}

export function VerificationForm({
  onVerificationStart,
  onVerificationComplete,
  isVerifying,
}: VerificationFormProps) {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
        return;
      }
      setError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageFile || !imagePreview) {
      setError('Please upload an image of the Aadhaar card.');
      return;
    }
    onVerificationStart(imagePreview);
    const resultId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      const aiResult = await extractFraudIndicators({ imageDataUri: imagePreview });
      const hasIndicators = aiResult.fraudIndicators && aiResult.fraudIndicators.toLowerCase().trim() !== 'no fraud indicators found.' && aiResult.fraudIndicators.trim() !== '';

      const result: VerificationResult = {
        id: resultId,
        timestamp: new Date(),
        imageDataUri: imagePreview,
        status: hasIndicators ? 'failed' : 'verified',
        indicators: hasIndicators ? aiResult.fraudIndicators : null,
        name: aiResult.name,
        dateOfBirth: aiResult.dateOfBirth,
        gender: aiResult.gender,
        address: aiResult.address,
        aadhaarNumber: aiResult.aadhaarNumber,
      };
      onVerificationComplete(result);
    } catch (error) {
      console.error('Verification Error:', error);
      const errorResult: VerificationResult = {
        id: resultId,
        timestamp: new Date(),
        imageDataUri: imagePreview,
        status: 'error',
        indicators: 'An unexpected error occurred during AI analysis.',
      };
      onVerificationComplete(errorResult);
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Could not connect to the AI service. Please try again later.',
      });
    }
  }

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    const input = document.getElementById('aadhaar-image-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aadhaar Image Verification</CardTitle>
        <CardDescription>
          Upload or drag-and-drop an image of an Aadhaar card to check for signs of forgery.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {imagePreview ? (
            <div className="relative group">
              <Image
                src={imagePreview}
                alt="Aadhaar card preview"
                width={400}
                height={250}
                className="w-full h-auto rounded-md object-contain border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <label
                htmlFor="aadhaar-image-upload"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors',
                  isDragging && 'border-primary bg-primary/10'
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, or WEBP (MAX. 5MB)</p>
                </div>
                <input id="aadhaar-image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
              </label>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isVerifying || !imageFile} className="w-full sm:w-auto">
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Aadhaar Image
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
