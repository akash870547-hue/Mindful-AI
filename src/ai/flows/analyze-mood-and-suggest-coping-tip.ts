'use server';

/**
 * @fileOverview Analyzes user's journal entry to detect mood and suggest coping strategies.
 *
 * - analyzeMoodAndSuggestCopingTip - A function that handles the mood analysis and coping suggestion process.
 * - AnalyzeMoodInput - The input type for the analyzeMoodAndSuggestCopingTip function.
 * - AnalyzeMoodOutput - The return type for the analyzeMoodAndSuggestCopingTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  AnalyzeMoodOutput,
  AnalyzeMoodOutputSchema,
} from '@/lib/types';

const AnalyzeMoodInputSchema = z.object({
  journalEntry: z.string().describe("The user's journal entry for the day."),
});
export type AnalyzeMoodInput = z.infer<typeof AnalyzeMoodInputSchema>;

export async function analyzeMoodAndSuggestCopingTip(
  input: AnalyzeMoodInput
): Promise<AnalyzeMoodOutput> {
  return analyzeMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMoodPrompt',
  input: {schema: AnalyzeMoodInputSchema},
  output: {schema: AnalyzeMoodOutputSchema},
  prompt: `Analyze the following journal entry to detect the user's mood, categorizing it as "Mild", "Moderate", or "Severe" distress.

Based on the mood, provide:
1.  A short, actionable mental solution (like a mindfulness exercise or a coping strategy).
2.  A simple, accessible physical activity suggestion (e.g., a 5-minute walk, stretching, breathing exercise).
3.  If and ONLY IF the mood is "Severe", include a gentle and empathetic emergency alert message. For "Mild" or "Moderate" moods, this field must be omitted.

Journal Entry: {{{journalEntry}}}

Respond in a direct JSON format.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const analyzeMoodFlow = ai.defineFlow(
  {
    name: 'analyzeMoodFlow',
    inputSchema: AnalyzeMoodInputSchema,
    outputSchema: AnalyzeMoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
