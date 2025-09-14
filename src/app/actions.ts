'use server';

import {
  suggestOptimalContribution,
  type SuggestOptimalContributionInput,
  type SuggestOptimalContributionOutput,
} from '@/ai/flows/suggest-optimal-contributions';
import { adminAuth } from '@/lib/firebase-admin';
import { addTransaction, updateUserGoals } from '@/lib/firestore';
import type { Transaction } from '@/lib/firestore';
import { z } from 'zod';

const inputSchema = z.object({
  savingsGoal: z.number(),
  targetBuildDate: z.string(),
  currentSavings: z.number(),
  monthlyIncome: z.number(),
});


export async function getAISuggestion(
  input: SuggestOptimalContributionInput
): Promise<{ data?: SuggestOptimalContributionOutput; error?: string }> {
  const parsedInput = inputSchema.safeParse(input);
  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await suggestOptimalContribution(parsedInput.data);
    return { data: result };
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    return { error: 'Failed to get suggestion from AI. Please try again later.' };
  }
}

export async function setSuperAdminClaim(uid: string, email: string): Promise<{ success: boolean; message?: string }> {
  if (!adminAuth) {
    console.log('Admin Auth not initialized, skipping setting claim');
    return { success: true, message: 'Admin Auth not initialized.'}
  }
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmail && email === adminEmail) {
        await adminAuth.setCustomUserClaims(uid, { super_admin: true });
        return { success: true, message: 'Super admin claim set.' };
    }
    return { success: true, message: 'Not an admin user.' };
  } catch (error: any) {
    console.error('Error setting super admin claim:', error);
    return { success: false, message: error.message };
  }
}

export async function handleGoalUpdateAction(uid: string, data: any) {
    await updateUserGoals(uid, data);
}

export async function addTransactionAction(uid: string, transaction: Transaction) {
    await addTransaction(uid, transaction);
}
