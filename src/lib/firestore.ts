'use server';

import {
  doc,
  setDoc,
  getDoc,
  collection,
  writeBatch,
  Timestamp,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Goal } from '@/components/dashboard/goal-settings';
import type { Currency } from '@/components/dashboard/dashboard';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  currency: Currency;
  currentSavings: number;
  monthlyContribution: number;
  targetDate?: Date;
  goals: Goal[];
}

export interface Transaction {
  id?: string;
  type: 'DEPOSIT' | 'RELEASE' | 'CONTRIBUTION';
  description: string;
  amount: number;
  date: Date;
}

const initialGoals: Goal[] = [
  { id: 'land', name: 'Land Purchase', amount: 750000 },
  { id: 'foundation', name: 'Foundation', amount: 500000 },
  { id: 'structure', name: 'Structure to Roof', amount: 850000 },
  { id: 'finishing', name: 'Finishing', amount: 400000 },
];

export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string
): Promise<UserProfile> {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const newUserProfile: UserProfile = {
      uid,
      email,
      displayName,
      currency: 'GMD',
      currentSavings: 485000,
      monthlyContribution: 75000,
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 30)),
      goals: initialGoals,
    };
    await setDoc(userRef, {
      ...newUserProfile,
      targetDate: Timestamp.fromDate(newUserProfile.targetDate!),
    });
    return newUserProfile;
  }
  return (await getUserProfile(uid))!;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      targetDate: data.targetDate?.toDate(),
    } as UserProfile;
  }
  return null;
}

const updateGoalSchema = z.object({
  goals: z.array(z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number(),
  })),
  monthlyContribution: z.number(),
  targetDate: z.date().optional(),
});


export async function updateUserGoals(uid: string, data: any) {
  const parsedData = updateGoalSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error('Invalid data for updating goals.');
  }

  const { goals, monthlyContribution, targetDate } = parsedData.data;

  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
      goals,
      monthlyContribution,
      targetDate: targetDate ? Timestamp.fromDate(targetDate) : null,
    },
    { merge: true }
  );

  revalidatePath('/dashboard');
}

export async function updateUserCurrency(uid: string, currency: Currency) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { currency }, { merge: true });
    revalidatePath('/dashboard');
}

export async function addTransaction(uid: string, transaction: Transaction) {
    const transactionsCollection = collection(db, `users/${uid}/transactions`);
    await addDoc(transactionsCollection, {
        ...transaction,
        date: Timestamp.fromDate(transaction.date),
    });

    if(transaction.type === 'DEPOSIT' || transaction.type === 'CONTRIBUTION') {
        const userRef = doc(db, 'users', uid);
        const userProfile = await getUserProfile(uid);
        if(userProfile) {
            await setDoc(userRef, {
                currentSavings: userProfile.currentSavings + transaction.amount,
            }, { merge: true });
        }
    }
    
    revalidatePath('/dashboard');
}

export async function getTransactions(uid: string): Promise<Transaction[]> {
    const transactionsCollection = collection(db, `users/${uid}/transactions`);
    const snapshot = await getDocs(transactionsCollection);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date.toDate()
        }
    }) as Transaction[];
}
