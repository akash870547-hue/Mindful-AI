
import {z} from 'genkit';
import {Timestamp} from 'firebase/firestore';

export const AnalyzeMoodOutputSchema = z.object({
  mood: z
    .enum(['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Grateful', 'Stressed', 'Tired', 'Overwhelmed', 'Nervous', 'No Face Detected'])
    .describe('The detected mood of the user.'),
  moodScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0 to 100 representing the intensity of the mood.'),
  mentalSolution: z
    .string()
    .nullable()
    .describe('A short, relevant mental solution or coping tip for the user.'),
  physicalActivity: z
    .string()
    .nullable()
    .describe(
      'A simple physical activity suggestion (e.g., breathing exercise, walk, yoga).'
    ),
    quote: z
    .string()
    .nullable()
    .optional()
    .describe('An inspiring or reflective quote relevant to the user\'s mood.'),
});
export type AnalyzeMoodOutput = z.infer<typeof AnalyzeMoodOutputSchema>;
export interface JournalEntry extends Omit<AnalyzeMoodOutput, 'emergencyMessage'> {
  id: string;
  createdAt: Date;
  journalEntry: string;
}

export interface JournalEntryFromDb extends Omit<AnalyzeMoodOutput, 'emergencyMessage'> {
  id: string;
  createdAt: Timestamp;
  journalEntry: string;
}
