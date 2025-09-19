
'use client';

import { useState, useEffect } from 'react';
import { BookText } from 'lucide-react';
import { JournalForm } from '@/components/journal-form';
import { MoodResult } from '@/components/mood-result';
import { PastEntriesList } from '@/components/past-entries';
import { analyzeEntry, getJournalEntries, saveJournalEntry, analyzeFaceExpressionAction, getSuggestions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry, MoodAnalysis, MoodSuggestions } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, LineChart } from 'lucide-react';
import { FacialAnalysis } from '@/components/facial-analysis';
import { ThemeToggle } from '@/components/theme-toggle';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<MoodAnalysis | null>(null);
  const [currentSuggestions, setCurrentSuggestions] = useState<MoodSuggestions | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadEntries() {
      const fetchedEntries = await getJournalEntries();
      setEntries(fetchedEntries);
    }
    loadEntries();
  }, []);

  async function handleFacialAnalysis(imageDataUri: string) {
    setCapturedImage(imageDataUri);
    await handleSubmit(analyzeFaceExpressionAction(imageDataUri));
  }
  
  async function handleTextAnalysis(journalEntry: string) {
    setCapturedImage(null);
    await handleSubmit(analyzeEntry(journalEntry), journalEntry);
  }

  async function handleSubmit(analysisPromise: Promise<{ data: MoodAnalysis | null; error: string | null }>, journalEntryText?: string) {
    setIsSubmitting(true);
    setCurrentAnalysis(null);
    setCurrentSuggestions(null);

    const analysisResult = await analysisPromise;
    setIsSubmitting(false);

    if (analysisResult.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: analysisResult.error,
      });
      return;
    } 
    
    if (analysisResult.data) {
      setCurrentAnalysis(analysisResult.data);
      
      // Start fetching suggestions in parallel
      setIsFetchingSuggestions(true);
      const suggestionsPromise = getSuggestions(analysisResult.data.mood, journalEntryText);
      
      // Don't wait for suggestions to save the entry
      const newEntryData: Omit<JournalEntry, 'id' | 'createdAt'> = {
        journalEntry: journalEntryText || `Facial analysis on ${new Date().toLocaleString()}`,
        mood: analysisResult.data.mood,
        moodScore: analysisResult.data.moodScore,
        mentalSolution: null,
        physicalActivity: null,
        quote: null,
      };

      const optimisticEntry: JournalEntry = {
        ...newEntryData,
        id: `optimistic-${Date.now()}`,
        createdAt: new Date(),
      };
      setEntries(prevEntries => [...prevEntries, optimisticEntry]);
      
      const saveResult = await saveJournalEntry(newEntryData);

      if (!saveResult.success) {
          toast({ variant: 'destructive', title: 'Database Error', description: saveResult.error });
          setEntries(prevEntries => prevEntries.filter(e => e.id !== optimisticEntry.id));
          // Don't proceed if save fails
          setIsFetchingSuggestions(false);
          return;
      }
      
      // Now, wait for suggestions
      const suggestionsResult = await suggestionsPromise;
      setIsFetchingSuggestions(false);

      if (suggestionsResult.data) {
        setCurrentSuggestions(suggestionsResult.data);

        // Update the entry in the DB with the suggestions (async, no need to wait)
        const fullEntryData = { ...newEntryData, ...suggestionsResult.data };
        saveJournalEntry(fullEntryData);

        // Update the optimistic entry with real ID and suggestions
        setEntries(prevEntries =>
          prevEntries.map(entry =>
            entry.id === optimisticEntry.id ? { ...fullEntryData, id: saveResult.id!, createdAt: new Date(saveResult.createdAt!) } : entry
          )
        );
      } else {
         // Update optimistic entry with just the real ID if suggestions fail
          setEntries(prevEntries => 
            prevEntries.map(entry => 
                entry.id === optimisticEntry.id ? { ...entry, id: saveResult.id!, createdAt: new Date(saveResult.createdAt!) } : entry
            )
        );
      }
    }
  }

  const fullResult = currentAnalysis ? { ...currentAnalysis, ...currentSuggestions } : null;

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
       <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookText className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl md:text-3xl font-bold">Mental Health AI Companion</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">
                <HomeIcon className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/progress">
                    <LineChart className="h-5 w-5" />
                    <span className="sr-only">Progress</span>
                </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <JournalForm
              onSubmit={(data) => handleTextAnalysis(data.journalEntry)}
              isSubmitting={isSubmitting}
            />
            <FacialAnalysis onSubmit={handleFacialAnalysis} isSubmitting={isSubmitting} />
            <MoodResult result={fullResult} isLoading={isSubmitting} isFetchingSuggestions={isFetchingSuggestions} image={capturedImage} />
          </div>
          <aside className="lg:col-span-2">
            <PastEntriesList entries={entries} />
          </aside>
        </div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Your personal space for reflection and growth.</p>
      </footer>
    </div>
  );
}
