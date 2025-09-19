
'use server';

import {
  analyzeMood
} from '@/ai/flows/analyze-mood-and-suggest-coping-tip';
import {
  analyzeFaceExpression,
} from '@/ai/flows/analyze-face-expression';
import {
    getSuggestionsForMood
} from '@/ai/flows/get-mood-suggestions';
import {
  textToSpeech,
  TextToSpeechOutput,
} from '@/ai/flows/text-to-speech';
import { db } from '@/lib/firebase/firebase';
import { JournalEntry, JournalEntryFromDb, MoodAnalysis, MoodSuggestions } from '@/lib/types';
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query, Timestamp } from 'firebase/firestore';

export async function analyzeEntry(
  journalEntry: string
): Promise<{ data: MoodAnalysis | null; error: string | null }> {
  if (!journalEntry || journalEntry.trim().length < 10) {
    return {
      data: null,
      error: 'Please write a bit more in your journal entry.',
    };
  }

  try {
    const result = await analyzeMood({ journalEntry });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        "Sorry, I couldn't analyze your entry right now. The AI model returned an unexpected response. Please try again.",
    };
  }
}

export async function analyzeFaceExpressionAction(
  photoDataUri: string
): Promise<{ data: MoodAnalysis | null; error: string | null }> {
  if (!photoDataUri) {
    return {
      data: null,
      error: 'No photo provided for analysis.',
    };
  }

  try {
    const result = await analyzeFaceExpression({ photoDataUri });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        "Sorry, I couldn't analyze your expression right now. The AI model returned an unexpected response. Please try again.",
    };
  }
}

export async function getSuggestions(
    mood: string,
    journalEntry?: string
): Promise<{ data: MoodSuggestions | null; error: string | null }> {
    try {
        const result = await getSuggestionsForMood({ mood, journalEntry });
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        return {
            data: null,
            error: "Sorry, I couldn't generate suggestions right now. Please try again."
        }
    }
}


export async function saveJournalEntry(
  entry: Omit<JournalEntry, 'id' | 'createdAt'>
): Promise<{ success: boolean; error: string | null; id?: string; createdAt?: string }> {
    try {
        const docRef = await addJournalEntry(entry);
        // We return a string for createdAt because Date objects are not serializable from Server Actions.
        return { success: true, error: null, id: docRef.id, createdAt: new Date().toISOString() };
    } catch (e) {
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        console.error('Error saving entry:', error);
        return { success: false, error: 'Could not save your journal entry.' };
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
        const docRef = await addDoc(collection(db, 'journalEntries'), {
            ...entry,
            createdAt: serverTimestamp(),
        });
        return docRef;
    } catch (error) {
        console.error('Error adding document: ', error);
        throw new Error('Could not save journal entry.');
    }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
    try {
        const q = query(collection(db, "journalEntries"), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data() as JournalEntryFromDb;
            // Ensure moodScore is handled correctly, providing a default if it's missing
            const moodScore = data.moodScore ?? 0; 
            return {
                id: doc.id,
                ...data,
                moodScore,
                createdAt: data.createdAt.toDate(),
            };
        });
    } catch (error) {
        console.error('Error getting documents: ', error);
        return [];
    }
}
