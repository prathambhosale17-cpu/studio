'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  CheckCircle2,
  Loader2,
  Search,
  Camera,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collectionGroup, query, where, getDocs } from 'firebase/firestore';
import type { IDCard } from '@/lib/types';
import { IdCardDisplay } from './id-card-display';
import { useToast } from '@/hooks/use-toast';
import { faceMatch, type FaceMatchOutput } from '@/ai/flows/face-match-flow';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type VerificationStep = 'idle' | 'fetching' | 'id_found' | 'capturing' | 'verifying' | 'result';

export function IdVerification() {
  const [idNumber, setIdNumber] = useState('');
  const [step, setStep] = useState<VerificationStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [foundCard, setFoundCard] = useState<IDCard | null>(null);
  const [matchResult, setMatchResult] = useState<FaceMatchOutput | null>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (step === 'capturing') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          setError('Camera access denied. Please enable camera permissions in your browser.');
        }
      };
      getCameraPermission();

      return () => {
        // Stop camera stream when component unmounts or step changes
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [step]);

  const handleSearch = () => {
    if (!idNumber.trim()) {
      setError('Please enter an ID number.');
      return;
    }
    setStep('fetching');
    setError(null);
    setFoundCard(null);

    // Use a collectionGroup query to search across all 'idCards' collections.
    const q = query(collectionGroup(firestore, 'idCards'), where('idNumber', '==', idNumber.trim()));
      
    getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          setError(`No ID card found with number: ${idNumber}`);
          setStep('idle');
        } else {
          const cardDoc = querySnapshot.docs[0];
          const cardData = {
              ...cardDoc.data(),
              id: cardDoc.id,
              createdAt: cardDoc.data().createdAt.toDate()
          } as IDCard;
          setFoundCard(cardData);
          setStep('id_found');
        }
      })
      .catch((e) => {
        // Use the global error emitter for permission errors.
        const permissionError = new FirestorePermissionError({
            path: 'idCards/{cardId}',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError('An error occurred while fetching the ID card. Check permissions.');
        setStep('idle');
      });
  };

  const capturePhoto = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
      }
    }
    return null;
  };

  const handleVerify = async () => {
    const liveUserPhoto = capturePhoto();
    if (!liveUserPhoto || !foundCard) {
      toast({
        variant: 'destructive',
        title: 'Verification Error',
        description: 'Could not capture photo or ID card data is missing.',
      });
      return;
    }

    setStep('verifying');
    setMatchResult(null);

    try {
      const result = await faceMatch({
        idCardPhoto: foundCard.photoDataUri,
        liveUserPhoto,
      });
      setMatchResult(result);
      setStep('result');
    } catch (e) {
      console.error('Face match error:', e);
      setError('AI face matching service failed. Please try again.');
      setStep('id_found'); // Go back to the previous step
    }
  };
  
  const resetVerification = () => {
    setIdNumber('');
    setStep('idle');
    setError(null);
    setFoundCard(null);
    setMatchResult(null);
  }

  const renderStepContent = () => {
    switch (step) {
      case 'idle':
      case 'fetching':
        return (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Enter the ID Number to begin verification.</p>
            <div className="flex gap-2">
              <Input
                placeholder="IDC-XXXXXX"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                disabled={step === 'fetching'}
              />
              <Button onClick={handleSearch} disabled={step === 'fetching'}>
                {step === 'fetching' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search />
                )}
                <span className="ml-2">Find ID</span>
              </Button>
            </div>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
        );
      case 'id_found':
        return (
          foundCard && (
            <div className="space-y-4 text-center">
              <p className="font-semibold">ID Card Found. Ready to verify.</p>
              <div className="flex justify-center">
                <IdCardDisplay card={foundCard} />
              </div>
              <Button onClick={() => setStep('capturing')} size="lg">
                <Camera className="mr-2" />
                Start Camera Verification
              </Button>
            </div>
          )
        );
      case 'capturing':
         return (
            <div className="space-y-4">
                 <div className="w-full aspect-video rounded-md overflow-hidden border bg-muted relative">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                 </div>
                 {hasCameraPermission === false && (
                     <Alert variant="destructive">
                         <AlertTitle>Camera Access Required</AlertTitle>
                         <AlertDescription>
                         Please allow camera access in your browser settings to use this feature.
                         </AlertDescription>
                     </Alert>
                 )}
                 <div className="flex justify-center gap-4">
                    <Button onClick={() => setStep('id_found')} variant="outline">Cancel</Button>
                    <Button onClick={handleVerify} disabled={!hasCameraPermission}>
                        <Camera className="mr-2" />
                        Capture & Verify
                    </Button>
                 </div>
            </div>
         );
      case 'verifying':
        return (
           <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
             <h3 className="text-xl font-bold mt-2">AI Analyzing...</h3>
             <p className="text-sm text-muted-foreground">Comparing facial features. Please wait.</p>
           </div>
        )
      case 'result':
        if (!matchResult) return null;
        const isMatch = matchResult.isMatch && matchResult.confidence > 0.7;
        const ResultIcon = isMatch ? CheckCircle2 : XCircle;
        const iconColor = isMatch ? 'text-green-500' : 'text-destructive';
        
        return (
            <div className="space-y-4">
                <div className={cn("flex flex-col items-center justify-center gap-2 p-6 text-center rounded-lg", isMatch ? 'bg-green-500/10' : 'bg-destructive/10')}>
                    <ResultIcon className={cn("h-12 w-12", iconColor)} />
                    <h3 className="text-2xl font-bold mt-2">{isMatch ? 'Verification Successful' : 'Verification Failed'}</h3>
                    <p className={cn("font-semibold", iconColor)}>
                        Face Match Confidence: { (matchResult.confidence * 100).toFixed(1) }%
                    </p>
                    <Progress value={matchResult.confidence * 100} className="w-full max-w-sm h-3" />
                </div>
                <Alert variant={isMatch ? 'default' : 'destructive'} className="bg-background">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>AI Analysis</AlertTitle>
                    <AlertDescription>{matchResult.reasoning}</AlertDescription>
                </Alert>
                <div className="text-center">
                    <Button onClick={resetVerification} variant="outline">Start New Verification</Button>
                </div>
            </div>
        )

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Card Verification</CardTitle>
        <CardDescription>
          Verify an ID card by matching the ID photo with a live camera feed.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderStepContent()}</CardContent>
    </Card>
  );
}
