'use server';

import {
  suggestOptimalContribution,
  type SuggestOptimalContributionInput,
  type SuggestOptimalContributionOutput,
} from '@/ai/flows/suggest-optimal-contributions';
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
