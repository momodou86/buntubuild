'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest an optimal monthly contribution amount
 *  based on the user's savings goal and target build date.
 *
 * - suggestOptimalContribution - A function that suggests an optimal monthly contribution amount.
 * - SuggestOptimalContributionInput - The input type for the suggestOptimalContribution function.
 * - SuggestOptimalContributionOutput - The return type for the suggestOptimalContribution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalContributionInputSchema = z.object({
  savingsGoal: z
    .number()
    .describe('The total amount of money the user wants to save.'),
  targetBuildDate: z
    .string()
    .describe(
      'The target date when the user wants to start building their home, in ISO format (YYYY-MM-DD).'
    ),
  currentSavings: z
    .number()
    .describe('The amount of money the user has already saved.'),
  monthlyIncome: z
    .number()
    .describe('The user\'s monthly income.'),
});
export type SuggestOptimalContributionInput = z.infer<
  typeof SuggestOptimalContributionInputSchema
>;

const SuggestOptimalContributionOutputSchema = z.object({
  suggestedMonthlyContribution: z
    .number()
    .describe(
      'The suggested monthly contribution amount to reach the savings goal by the target build date.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the suggested monthly contribution amount, considering the savings goal, target build date, current savings, and monthly income.'
    ),
});
export type SuggestOptimalContributionOutput = z.infer<
  typeof SuggestOptimalContributionOutputSchema
>;

export async function suggestOptimalContribution(
  input: SuggestOptimalContributionInput
): Promise<SuggestOptimalContributionOutput> {
  return suggestOptimalContributionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalContributionPrompt',
  input: {schema: SuggestOptimalContributionInputSchema},
  output: {schema: SuggestOptimalContributionOutputSchema},
  prompt: `You are a financial advisor helping a user determine the optimal monthly contribution amount to reach their savings goal for building a home.

  The user\'s savings goal is {{savingsGoal}}.
  The user\'s target build date is {{targetBuildDate}}.
  The user\'s current savings are {{currentSavings}}.
  The user\'s monthly income is {{monthlyIncome}}.

  Calculate the suggested monthly contribution amount to reach the savings goal by the target build date, taking into account the current savings. Also, consider the user\'s monthly income to ensure the suggested contribution is reasonable and sustainable.

  Provide a clear and concise reasoning for the suggested amount, explaining the factors considered in the calculation.

  Ensure that the suggestedMonthlyContribution is an integer.`,
});

const suggestOptimalContributionFlow = ai.defineFlow(
  {
    name: 'suggestOptimalContributionFlow',
    inputSchema: SuggestOptimalContributionInputSchema,
    outputSchema: SuggestOptimalContributionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
