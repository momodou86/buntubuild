'use server';

import {
  suggestOptimalContribution,
  type SuggestOptimalContributionInput,
  type SuggestOptimalContributionOutput,
} from '@/ai/flows/suggest-optimal-contributions';
import { adminAuth } from '@/lib/firebase-admin';
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

export async function setSuperAdminClaim(uid: string): Promise<{ success: boolean; message?: string }> {
  if (!adminAuth) {
    console.log('Admin Auth not initialized, skipping setting claim');
    return { success: true, message: 'Admin Auth not initialized.'}
  }
  try {
    const { users } = await adminAuth.listUsers(1);
    if (users.length > 1) {
      // More than just the newly created user exists, so don't grant admin
      return { success: true };
    }

    // This is the first user, grant super admin role
    await adminAuth.setCustomUserClaims(uid, { super_admin: true });
    return { success: true, message: 'Super admin claim set.' };
  } catch (error: any) {
    console.error('Error setting super admin claim:', error);
    return { success: false, message: error.message };
  }
}
