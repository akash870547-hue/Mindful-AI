import type { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood-and-suggest-coping-tip';
import { Timestamp } from 'firebase/firestore';

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
