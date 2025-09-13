
'use server';

import {
  analyzeMoodAndSuggestCopingTip,
  AnalyzeMoodOutput,
} from '@/ai/flows/analyze-mood-and-suggest-coping-tip';

export async function analyzeEntry(
  journalEntry: string
): Promise<{ data: AnalyzeMoodOutput | null; error: string | null }> {
  if (!journalEntry || journalEntry.trim().length < 10) {
    return {
      data: null,
      error: 'Please write a bit more in your journal entry.',
    };
  }

  try {
    const result = await analyzeMoodAndSuggestCopingTip({ journalEntry });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        "Sorry, I couldn't analyze your entry right now. Please try again later.",
    };
  }
}
