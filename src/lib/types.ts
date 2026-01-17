export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'error' | 'idle';

export type VerificationResult = {
  id: string;
  timestamp: Date;
  status: VerificationStatus;
  aadhaarData: string;
  indicators: string | null;
};
