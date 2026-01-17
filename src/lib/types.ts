export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'error' | 'idle';

export type VerificationResult = {
  id: string;
  timestamp: Date;
  status: VerificationStatus;
  imageDataUri: string | null;
  indicators: string | null;
};
