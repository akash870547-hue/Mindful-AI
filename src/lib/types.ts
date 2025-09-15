
import {z} from 'genkit';
import {Timestamp} from 'firebase/firestore';

export const AnalyzeMoodOutputSchema = z.object({
  mood: z
    .enum(['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Mild', 'Moderate', 'Severe', 'Grateful', 'Stressed', 'Tired', 'Overwhelmed'])
    .describe('The detected mood of the user.'),
  moodScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0 to 100 representing the intensity of the mood.'),
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
    .nullable()
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
