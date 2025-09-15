
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
  prompt: `Analyze the facial expression in the following image for a deep analysis of the user's mood.

First, determine if a clear human face is visible.
- If NO clear face is detected, you MUST respond with "No Face Detected" as the mood, a moodScore of 0, and null for all other fields.
- If a face IS detected, proceed with the deep analysis.

Look for subtle cues in the user's expression (e.g., tension in the brow, the shape of the mouth, the look in their eyes) to inform your analysis.

Based on the detected mood, provide:
1.  **Mood**: Categorize the mood. It MUST be one of the following: "Happy", "Sad", "Angry", "Anxious", "Calm", "Grateful", "Stressed", "Tired", "Overwhelmed", or "No Face Detected".
2.  **Mood Score**: Provide a numerical score from 0 to 100 indicating the intensity of the detected mood. A higher score means a more intense or severe mood.
3.  **Mental Solution**: Provide a short, actionable mental solution. Briefly reference a facial cue in your explanation (e.g., "I noticed some tension around your eyes, which suggests you're stressed. Try this...").
4.  **Physical Activity**: Provide a simple, accessible physical activity suggestion.
5.  **Emergency Message**: If the expression indicates severe distress (e.g., anguish, crying, deep despair), include a gentle and empathetic emergency alert message. For all other moods, this field MUST be null.

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
