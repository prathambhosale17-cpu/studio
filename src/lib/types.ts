import type { Timestamp } from "firebase/firestore";

export type IDCard = {
  id: string; // The document ID in Firestore
  userId: string;
  name: string;
  dateOfBirth: string;
  photoDataUri: string;
  idNumber: string; // A unique, human-readable ID number
  createdAt: Date;
};

export type FirestoreIDCard = Omit<IDCard, 'createdAt'> & {
  createdAt: Timestamp;
};
