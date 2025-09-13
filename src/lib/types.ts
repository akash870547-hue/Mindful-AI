import type { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood-and-suggest-coping-tip';

export interface JournalEntry extends AnalyzeMoodOutput {
  id: string;
  createdAt: Date;
  journalEntry: string;
}
