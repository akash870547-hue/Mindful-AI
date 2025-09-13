
'use server';

import {
  analyzeMoodAndSuggestCopingTip,
  AnalyzeMoodOutput,
} from '@/ai/flows/analyze-mood-and-suggest-coping-tip';
import {
  textToSpeech,
  TextToSpeechOutput,
} from '@/ai/flows/text-to-speech';
import { db } from '@/lib/firebase/firebase';
import { JournalEntry, JournalEntryFromDb } from '@/lib/types';
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query } from 'firebase/firestore';

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
    // Also save to database
    if (result) {
      await addJournalEntry({
        journalEntry,
        ...result,
      });
    }
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

export async function getSpeech(
  text: string
): Promise<{ data: TextToSpeechOutput | null; error: string | null }> {
  if (!text) {
    return { data: null, error: 'No text provided for speech synthesis.' };
  }

  try {
    const result = await textToSpeech({ text });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        "Sorry, I couldn't generate audio right now. Please try again later.",
    };
  }
}

export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>) {
    try {
        await addDoc(collection(db, 'journalEntries'), {
            ...entry,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error adding document: ', error);
        throw new Error('Could not save journal entry.');
    }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
    try {
        const q = query(collection(db, "journalEntries"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data() as JournalEntryFromDb;
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
            };
        });
    } catch (error) {
        console.error('Error getting documents: ', error);
        return [];
    }
}
