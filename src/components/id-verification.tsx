'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  CheckCircle2,
  Loader2,
  Camera,
  XCircle,
  AlertCircle,
  UploadCloud,
  ShieldCheck,
  UserCheck,
  Database,
} from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collectionGroup, query, where, getDocs } from 'firebase/firestore';
import type { IDCard } from '@/lib/types';
import { IdCardDisplay } from './id-card-display';
import { useToast } from '@/hooks/use-toast';
import { faceMatch, type FaceMatchOutput } from '@/ai/flows/face-match-flow';
import { extractIdDetails } from '@/ai/flows/extract-id-details';
import { extractFraudIndicators, type ExtractFraudIndicatorsOutput } from '@/ai/flows/extract-fraud-indicators';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type VerificationStep = 'scan' | 'analyzing' | 'fetching' | 'id_found' | 'capturing' | 'verifying' | 'result';

type DataMatchResult = {
  isMatch: boolean;
  mismatchedFields: {
    field: string;
    dbValue: string;
    ocrValue: string | null;
  }[];
} | null;

type AnalysisResults = {
  fraud?: ExtractFraudIndicatorsOutput | null;
  face?: FaceMatchOutput | null;
  dataMatch?: DataMatchResult;
}

export function IdVerification() {
  const [step, setStep] = useState<VerificationStep>('scan');
  const [error, setError] = useState<string | null>(null);
  const [foundCard, setFoundCard] = useState<IDCard | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({});
  const [scannedIdImage, setScannedIdImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    // Camera effect
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
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [step]);
  
  const resetVerification = (backToScan = true) => {
    setError(null);
    setFoundCard(null);
    setAnalysisResults({});
    setScannedIdImage(null);
    if (backToScan) {
      setStep('scan');
    }
  };

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUri = reader.result as string;
        setScannedIdImage(imageDataUri);
        handleImageScan(imageDataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageScan = async (imageDataUri: string) => {
    resetVerification(false);
    setStep('analyzing');

    try {
      const [idResult, fraudResult] = await Promise.all([
        extractIdDetails({ imageDataUri }),
        extractFraudIndicators({ imageDataUri }),
      ]);
      
      setAnalysisResults({ fraud: fraudResult });

      if (!idResult?.idNumber) {
        setError('Could not read the ID Number from the card. Please try again with a clearer image.');
        setStep('scan');
        setScannedIdImage(null);
        return;
      }
      
      setStep('fetching');
      const idNumber = idResult.idNumber;
      const q = query(collectionGroup(firestore, 'idCards'), where('idNumber', '==', idNumber.trim()));
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError(`No ID card found in the system with number: ${idNumber}`);
        setStep('scan');
        setScannedIdImage(null);
      } else {
        const cardDoc = querySnapshot.docs[0];
        const cardData = {
          ...cardDoc.data(),
          id: cardDoc.id,
          createdAt: cardDoc.data().createdAt.toDate()
        } as IDCard;
        
        // Perform data matching
        const ocrData = fraudResult;
        const dbData = cardData;
        const mismatchedFields: { field: string; dbValue: string; ocrValue: string | null }[] = [];
        const normalize = (str: string | null | undefined) => (str || '').trim().toLowerCase();

        if (normalize(ocrData.name) !== normalize(dbData.name)) {
            mismatchedFields.push({ field: 'Name', dbValue: dbData.name, ocrValue: ocrData.name });
        }

        let ocrDobFormatted = ocrData.dateOfBirth;
        if (ocrDobFormatted) {
            const parts = ocrDobFormatted.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            if (parts) {
                ocrDobFormatted = `${parts[3]}-${parts[2]}-${parts[1]}`;
            }
        }
        if (ocrDobFormatted !== dbData.dateOfBirth) {
            mismatchedFields.push({ field: 'Date of Birth', dbValue: dbData.dateOfBirth, ocrValue: ocrData.dateOfBirth });
        }
        
        if (normalize(ocrData.gender) !== normalize(dbData.gender)) {
            mismatchedFields.push({ field: 'Gender', dbValue: dbData.gender, ocrValue: ocrData.gender });
        }

        const dataMatchResult: DataMatchResult = {
            isMatch: mismatchedFields.length === 0,
            mismatchedFields,
        };

        setAnalysisResults(prev => ({...prev, dataMatch: dataMatchResult }));
        setFoundCard(cardData);
        setStep('id_found');
      }

    } catch (e: any) {
      console.error("ID Scan/Fetch Error:", e);
      if (e.name === 'FirebaseError') {
         const permissionError = new FirestorePermissionError({
            path: 'idCards (collection group)',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError('An error occurred while fetching the ID card. Check permissions.');
      } else if (/api key/i.test(e.message)) {
          setError('AI Service Misconfigured: Your Gemini API key is missing or invalid. Please add a valid GEMINI_API_KEY to your .env file and restart the server.');
      } else {
        setError('An AI service error occurred. Please try again.');
      }
      setStep('scan');
      setScannedIdImage(null);
    }
  }

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

  const handleFaceVerify = async () => {
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

    try {
      const result = await faceMatch({
        idCardPhoto: foundCard.photoDataUri,
        liveUserPhoto,
      });
      setAnalysisResults(prev => ({...prev, face: result}));
      setStep('result');
    } catch (e: any) {
      console.error('Face match error:', e);
      if (/api key/i.test(e.message)) {
          setError('AI Service Misconfigured: Your Gemini API key is missing or invalid. Please add a valid GEMINI_API_KEY to your .env file and restart the server.');
      } else {
          setError('AI face matching service failed. Please try again.');
      }
      setStep('id_found'); // Go back to the previous step
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'scan':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Upload or drag-and-drop an image of an ID card to begin the AI verification process.
            </p>
             <label
                htmlFor="id-card-upload"
                onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
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
                <input id="id-card-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
              </label>
              {error && (
                 <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
          </div>
        );
      
      case 'analyzing':
      case 'fetching':
         return (
           <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[200px]">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
             <h3 className="text-xl font-bold mt-2">AI Analyzing...</h3>
             <p className="text-sm text-muted-foreground">
                {step === 'analyzing' ? 'Extracting ID details and checking for forgery...' : 'Fetching official record from database...'}
             </p>
           </div>
        )
      
      case 'id_found':
        return (
          foundCard && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-semibold">ID Card Record Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">The ID card has been found in the database. Please proceed to the live face match step to complete verification.</p>
              <div className="flex justify-center">
                <IdCardDisplay card={foundCard} />
              </div>
               {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={() => setStep('capturing')} size="lg">
                <Camera className="mr-2" />
                Proceed to Face Match
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
                         <AlertDescription>Please allow camera access to use this feature.</AlertDescription>
                     </Alert>
                 )}
                 <div className="flex justify-center gap-4">
                    <Button onClick={() => setStep('id_found')} variant="outline">Back</Button>
                    <Button onClick={handleFaceVerify} disabled={!hasCameraPermission}>
                        <Camera className="mr-2" />
                        Capture & Verify Face
                    </Button>
                 </div>
            </div>
         );

      case 'verifying':
        return (
           <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[200px]">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
             <h3 className="text-xl font-bold mt-2">AI Verifying Face...</h3>
             <p className="text-sm text-muted-foreground">Comparing facial features. Please wait.</p>
           </div>
        )

      case 'result':
        const { face, dataMatch, fraud } = analysisResults;
        if (!face || !dataMatch) return null;

        const isOverallSuccess = face.isMatch && dataMatch.isMatch;
        const ResultIcon = isOverallSuccess ? CheckCircle2 : XCircle;
        const iconColor = isOverallSuccess ? 'text-green-500' : 'text-destructive';
        const hasFraudIndicators = fraud && fraud.fraudIndicators.toLowerCase().trim() !== 'no fraud indicators found.' && fraud.fraudIndicators.trim() !== '';

        return (
            <div className="space-y-6">
                <div className={cn("flex flex-col items-center justify-center gap-2 p-6 text-center rounded-lg", isOverallSuccess ? 'bg-green-500/10' : 'bg-destructive/10')}>
                    <ResultIcon className={cn("h-12 w-12", iconColor)} />
                    <h3 className="text-2xl font-bold mt-2">{isOverallSuccess ? 'Verification Successful' : 'Verification Failed'}</h3>
                     <p className="text-muted-foreground">The ID has been checked against the database and live photo.</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    <Alert variant={face.isMatch ? 'default' : 'destructive'} className="bg-background">
                        <UserCheck className="h-4 w-4" />
                        <AlertTitle>Face Match</AlertTitle>
                        <AlertDescription>{face.reasoning} ({(face.confidence * 100).toFixed(1)}% confidence)</AlertDescription>
                    </Alert>
                    <Alert variant={dataMatch.isMatch ? 'default' : 'destructive'} className="bg-background">
                        <Database className="h-4 w-4" />
                        <AlertTitle>Data Match</AlertTitle>
                        <AlertDescription>
                            {dataMatch.isMatch ? 'Card data matches database.' : `Mismatch in: ${dataMatch.mismatchedFields.map(f => f.field).join(', ')}`}
                        </AlertDescription>
                    </Alert>
                    <Alert variant={hasFraudIndicators ? 'destructive' : 'default'} className="bg-background">
                        <ShieldCheck className="h-4 w-4" />
                        <AlertTitle>Forgery Analysis</AlertTitle>
                        <AlertDescription>{fraud?.fraudIndicators}</AlertDescription>
                    </Alert>
                </div>

                {!dataMatch.isMatch && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Mismatch Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-2 text-sm">
                                {dataMatch.mismatchedFields.map(({ field, dbValue, ocrValue }) => (
                                    <li key={field} className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                                        <span className="font-semibold">{field}</span>
                                        <span className="text-muted-foreground">Database: <span className="text-foreground font-medium">{dbValue}</span></span>
                                        <span className="text-muted-foreground">On Card: <span className="text-foreground font-medium">{ocrValue || 'Not Found'}</span></span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <div className="text-center">
                    <Button onClick={() => resetVerification()} variant="outline">Start New Verification</Button>
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
        <CardTitle>AI-Powered ID Verification</CardTitle>
        <CardDescription>
          A multi-step AI process to verify an identity document.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderStepContent()}</CardContent>
    </Card>
  );
}
