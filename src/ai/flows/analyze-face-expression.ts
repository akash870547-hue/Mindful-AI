
'use server';

/**
 * @fileOverview Analyzes a user's facial expression from an image to determine their mood.
 *
 * - analyzeFaceExpressionFlow - A function that handles the facial expression analysis.
 * - AnalyzeFaceExpressionInput - The input type for the analyzeFaceExpressionFlow function.
 * - MoodAnalysis - The return type, shared with the text-based mood analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  MoodAnalysis,
  MoodAnalysisSchema,
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
): Promise<MoodAnalysis> {
  return analyzeFaceExpressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFaceExpressionPrompt',
  input: { schema: AnalyzeFaceExpressionInputSchema },
  output: { schema: MoodAnalysisSchema },
  prompt: `Analyze the facial expression in the following image to determine the user's mood.

First, determine if a clear human face is visible.
- If NO clear face is detected, you MUST respond with "No Face Detected" as the mood and a moodScore of 0.
- If a face IS detected, proceed with the analysis.

Based on the detected mood, provide:
1.  **Mood**: Categorize the mood. It MUST be one of the following: "Happy", "Sad", "Angry", "Anxious", "Calm", "Grateful", "Stressed", "Tired", "Overwhelmed", "Nervous", or "No Face Detected".
2.  **Mood Score**: Provide a numerical score from 0 to 100 indicating the intensity of the detected mood.

Photo: {{media url=photoDataUri}}

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

const analyzeFaceExpressionFlow = ai.defineFlow(
  {
    name: 'analyzeFaceExpressionFlow',
    inputSchema: AnalyzeFaceExpressionInputSchema,
    outputSchema: MoodAnalysisSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
