import type { Timestamp } from "firebase/firestore";

export type IDCard = {
  id: string; // The document ID in Firestore
  userId: string;
  name: string;
  dateOfBirth: string;
  photoDataUri: string;
  idNumber: string; // A unique, human-readable ID number
  createdAt: Date;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  qrCodeDataUri: string;
  aadhaarNumber?: string | null;
};

export type FirestoreIDCard = Omit<IDCard, 'createdAt'> & {
  createdAt: Timestamp;
};

export type VerificationStatus = 'idle' | 'pending' | 'verified' | 'failed' | 'error';

export type DataMatchResult = {
  status: 'matched' | 'mismatched' | 'not_found' | 'error' | 'loading';
  details?: { field: string; dbValue: any; ocrValue: any }[];
};


export type VerificationResult = {
  id: string;
  userId?: string;
  timestamp: Date;
  imageDataUri: string;
  status: VerificationStatus;
  indicators: string | null;
  name?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  aadhaarNumber?: string | null;
  dataMatch?: DataMatchResult | null;
};
