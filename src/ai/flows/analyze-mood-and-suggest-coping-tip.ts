'use server';

/**
 * @fileOverview Analyzes user's journal entry to detect mood and suggest a coping tip.
 *
 * - analyzeMoodAndSuggestCopingTip - A function that handles the mood analysis and coping tip suggestion process.
 * - AnalyzeMoodInput - The input type for the analyzeMoodAndSuggestCopingTip function.
 * - AnalyzeMoodOutput - The return type for the analyzeMoodAndSuggestCopingTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMoodInputSchema = z.object({
  journalEntry: z.string().describe('The user\'s journal entry for the day.'),
});
export type AnalyzeMoodInput = z.infer<typeof AnalyzeMoodInputSchema>;

const AnalyzeMoodOutputSchema = z.object({
  mood: z
    .enum(['Mild', 'Moderate', 'Severe'])
    .describe('The detected mood of the user (Mild, Moderate, or Severe).'),
  copingTip: z.string().describe('A short, relevant coping tip for the user.'),
});
export type AnalyzeMoodOutput = z.infer<typeof AnalyzeMoodOutputSchema>;

export async function analyzeMoodAndSuggestCopingTip(
  input: AnalyzeMoodInput
): Promise<AnalyzeMoodOutput> {
  return analyzeMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMoodPrompt',
  input: {schema: AnalyzeMoodInputSchema},
  output: {schema: AnalyzeMoodOutputSchema},
  prompt: `Analyze the following journal entry and detect the user's mood (Mild, Moderate, or Severe). Based on the detected mood, suggest one short, relevant coping tip.

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
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_NONE',
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
