'use server';
import {z} from 'genkit';
import {Timestamp} from 'firebase/firestore';

export const AnalyzeMoodOutputSchema = z.object({
  mood: z
    .enum(['Mild', 'Moderate', 'Severe'])
    .describe('The detected mood of the user (Mild, Moderate, or Severe).'),
  mentalSolution: z
    .string()
    .describe('A short, relevant mental solution or coping tip for the user.'),
  physicalActivity: z
    .string()
    .describe(
      'A simple physical activity suggestion (e.g., breathing exercise, walk, yoga).'
    ),
  emergencyMessage: z
    .string()
    .optional()
    .describe(
      'An empathetic emergency alert message, only to be provided if the mood is detected as "Severe".'
    ),
});
export type AnalyzeMoodOutput = z.infer<typeof AnalyzeMoodOutputSchema>;
export interface JournalEntry extends AnalyzeMoodOutput {
  id: string;
  createdAt: Date;
  journalEntry: string;
}

export interface JournalEntryFromDb extends AnalyzeMoodOutput {
  id: string;
  createdAt: Timestamp;
  journalEntry: string;
}
