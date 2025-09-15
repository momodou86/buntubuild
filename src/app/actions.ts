
'use server';

import {
  suggestOptimalContribution,
  type SuggestOptimalContributionInput,
  type SuggestOptimalContributionOutput,
} from '@/ai/flows/suggest-optimal-contributions';
import { adminAuth } from '@/lib/firebase-admin';
import { addTransaction, createUserProfile, getUserProfile, updateUserGoals, getTransactions as getUserTransactions } from '@/lib/firestore';
import type { Transaction } from '@/lib/firestore';
import {
  createRole as createRoleInFirestore,
  getRoles as getRolesFromFirestore,
  updateRole as updateRoleInFirestore,
  type Role,
} from '@/lib/firestore-roles';
import { z } from 'zod';
import type { UserRecord } from 'firebase-admin/auth';
import { revalidatePath } from 'next/cache';

const inputSchema = z.object({
  savingsGoal: z.number(),
  targetBuildDate: z.string(),
  currentSavings: z.number(),
  monthlyIncome: z.number(),
});


export async function getAISuggestion(
  input: SuggestOptimalContributionInput
): Promise<SuggestOptimalContributionOutput> {
  const parsedInput = inputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input.');
  }

  try {
    const result = await suggestOptimalContribution(parsedInput.data);
    return result;
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    throw new Error('Failed to get suggestion from AI. Please try again later.');
  }
}

export async function setSuperAdminClaim(uid: string, email: string): Promise<{ success: boolean; message?: string }> {
  // This function is now primarily for backend/rules validation.
  // The client-side relies on the `isAdmin` flag in Firestore.
  if (!adminAuth) {
    console.log('Admin Auth not initialized, skipping setting claim');
    // We don't throw here because this is not a critical failure during sign-up.
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
    // We don't want to block sign-up if this fails.
    return { success: false, message: error.message };
  }
}

export async function handleGoalUpdateAction(uid: string, data: any) {
    await updateUserGoals(uid, data);
}

export async function addTransactionAction(uid: string, transaction: Transaction) {
    await addTransaction(uid, transaction);
}

// A plain object to be passed from Server to Client Components
export type PlainUser = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  customClaims?: { [key: string]: any };
};


export async function getAllUsers(): Promise<PlainUser[]> {
  if (!adminAuth) {
    console.error('Admin Auth not initialized, cannot fetch users.');
    throw new Error('Admin service not available.');
  }
  try {
    const userRecords = await adminAuth.listUsers();
    
    // Enrich users with firestore data and convert to plain objects
    const enrichedUsers = await Promise.all(
        userRecords.users.map(async (user) => {
            const profile = await getUserProfile(user.uid);
            // We'll add the isAdmin flag to the customClaims object for the frontend to use.
            // This avoids changing the UserRecord type structure extensively.
            if (profile) {
                user.customClaims = { ...user.customClaims, super_admin: profile.isAdmin };
            }
            // Convert UserRecord to a plain object
            return {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              disabled: user.disabled,
              metadata: {
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
              },
              customClaims: user.customClaims,
            };
        })
    );

    return enrichedUsers;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }
}

export async function toggleUserDisabled(uid: string, disabled: boolean): Promise<{ success: boolean; message?: string }> {
    if (!adminAuth) {
        throw new Error('Admin service not available.');
    }
    try {
        await adminAuth.updateUser(uid, { disabled: disabled });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error('Error toggling user status:', error);
        return { success: false, message: error.message };
    }
}

export async function getAllTransactions(): Promise<Transaction[]> {
    if (!adminAuth) {
        console.error('Admin Auth not initialized, cannot fetch all transactions.');
        throw new Error('Admin service not available.');
    }
    try {
        const users = await adminAuth.listUsers();
        const allTransactions: Transaction[] = [];

        for (const user of users.users) {
            const userTransactions = await getUserTransactions(user.uid);
            allTransactions.push(...userTransactions);
        }

        return allTransactions;
    } catch (error: any) {
        console.error('Error fetching all transactions:', error);
        throw new Error(error.message);
    }
}

export async function getRoles(): Promise<Role[]> {
  return await getRolesFromFirestore();
}

export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const newRole = await createRoleInFirestore(role);
  revalidatePath('/admin/roles');
  return newRole;
}

export async function updateRole(id: string, role: Omit<Role, 'id' | 'name'>): Promise<void> {
  await updateRoleInFirestore(id, role);
  revalidatePath('/admin/roles');
}
