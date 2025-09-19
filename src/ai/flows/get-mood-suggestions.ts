
'use server';

/**
 * @fileOverview Generates suggestions based on a user's mood.
 *
 * - getSuggestionsForMood - A function that provides tailored suggestions.
 * - GetSuggestionsInput - The input type for the function.
 * - MoodSuggestions - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MoodSuggestionsSchema, MoodSuggestions } from '@/lib/types';

const GetSuggestionsInputSchema = z.object({
  mood: z.string().describe("The user's detected mood."),
  journalEntry: z.string().optional().describe("The user's journal entry, if provided."),
});
export type GetSuggestionsInput = z.infer<typeof GetSuggestionsInputSchema>;


export async function getSuggestionsForMood(
  input: GetSuggestionsInput
): Promise<MoodSuggestions> {
  return getSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSuggestionsPrompt',
  input: { schema: GetSuggestionsInputSchema },
  output: { schema: MoodSuggestionsSchema },
  prompt: `Based on the user's mood of "{{mood}}", provide the following:

1.  **Mental Solution**: Provide a short, actionable mental solution (like a mindfulness exercise or a coping strategy).
2.  **Physical Activity**: Provide a simple, accessible physical activity suggestion (e.g., a 5-minute walk, stretching).
3.  **Quote**: Provide an inspiring or reflective quote that is relevant to the user's mood.

{{#if journalEntry}}
Here is the user's journal entry for additional context:
"{{{journalEntry}}}"
{{/if}}

Respond in a direct JSON format.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
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

const getSuggestionsFlow = ai.defineFlow(
  {
    name: 'getSuggestionsFlow',
    inputSchema: GetSuggestionsInputSchema,
    outputSchema: MoodSuggestionsSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
