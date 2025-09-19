
'use server';

/**
 * @fileOverview Analyzes user's journal entry to detect mood.
 *
 * - analyzeMood - A function that handles the mood analysis.
 * - AnalyzeMoodInput - The input type for the analyzeMood function.
 * - MoodAnalysis - The return type for the analyzeMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  MoodAnalysis,
  MoodAnalysisSchema
} from '@/lib/types';

const AnalyzeMoodInputSchema = z.object({
  journalEntry: z.string().describe("The user's journal entry for the day."),
});
export type AnalyzeMoodInput = z.infer<typeof AnalyzeMoodInputSchema>;

export async function analyzeMood(
  input: AnalyzeMoodInput
): Promise<MoodAnalysis> {
  return analyzeMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMoodPrompt',
  input: {schema: AnalyzeMoodInputSchema},
  output: {schema: MoodAnalysisSchema},
  prompt: `Analyze the following journal entry to detect the user's mood.

1.  **Mood**: Categorize the mood. It MUST be one of the following: "Happy", "Sad", "Angry", "Anxious", "Calm", "Grateful", "Stressed", "Tired", "Overwhelmed", "Nervous".
2.  **Mood Score**: Provide a numerical score from 0 to 100 indicating the intensity of the detected mood. A higher score means a more intense or severe mood.

Journal Entry: {{{journalEntry}}}

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

const analyzeMoodFlow = ai.defineFlow(
  {
    name: 'analyzeMoodFlow',
    inputSchema: AnalyzeMoodInputSchema,
    outputSchema: MoodAnalysisSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
