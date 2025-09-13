'use server';

/**
 * @fileOverview Analyzes a user's facial expression from an image to determine their mood.
 *
 * - analyzeFaceExpressionFlow - A function that handles the facial expression analysis.
 * - AnalyzeFaceExpressionInput - The input type for the analyzeFaceExpressionFlow function.
 * - AnalyzeMoodOutput - The return type, shared with the text-based mood analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  AnalyzeMoodOutput,
  AnalyzeMoodOutputSchema,
} from '@/lib/types';

const AnalyzeFaceExpressionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFaceExpressionInput = z.infer<typeof AnalyzeFaceExpressionInputSchema>;


export async function analyzeFaceExpression(
  input: AnalyzeFaceExpressionInput
): Promise<AnalyzeMoodOutput> {
  return analyzeFaceExpressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFaceExpressionPrompt',
  input: { schema: AnalyzeFaceExpressionInputSchema },
  output: { schema: AnalyzeMoodOutputSchema },
  prompt: `Analyze the facial expression in the following image to detect the user's mood. Categorize the mood as "Mild", "Moderate", or "Severe" distress based on their expression (e.g., smiling/neutral -> Mild, frowning/sad -> Moderate, crying/anguish -> Severe).

Based on the detected mood, provide:
1.  A short, actionable mental solution (like a mindfulness exercise or a coping strategy relevant to the expression).
2.  A simple, accessible physical activity suggestion (e.g., a 5-minute walk, stretching, breathing exercise).
3.  If and ONLY IF the mood is "Severe", include a gentle and empathetic emergency alert message. For "Mild" or "Moderate" moods, this field must be omitted.

Photo: {{media url=photoDataUri}}

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

const analyzeFaceExpressionFlow = ai.defineFlow(
  {
    name: 'analyzeFaceExpressionFlow',
    inputSchema: AnalyzeFaceExpressionInputSchema,
    outputSchema: AnalyzeMoodOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
