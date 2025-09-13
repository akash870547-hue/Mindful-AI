'use client';

import { useState, useEffect } from 'react';
import { BookText } from 'lucide-react';
import { JournalForm } from '@/components/journal-form';
import { MoodResult } from '@/components/mood-result';
import { PastEntriesList } from '@/components/past-entries';
import { analyzeEntry, getJournalEntries, saveJournalEntry } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry, AnalyzeMoodOutput } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, LineChart } from 'lucide-react';
import { FacialAnalysis } from '@/components/facial-analysis';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalyzeMoodOutput | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadEntries() {
      const fetchedEntries = await getJournalEntries();
      setEntries(fetchedEntries);
    }
    loadEntries();
  }, []);

  async function handleSubmit(analysisPromise: Promise<{ data: AnalyzeMoodOutput | null; error: string | null }>, journalEntryText?: string) {
    setIsSubmitting(true);
    setCurrentResult(null);

    const result = await analysisPromise;
    setIsSubmitting(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: result.error,
      });
      return;
    } 
    
    if (result.data) {
      setCurrentResult(result.data);
      
      const newEntryData = {
        journalEntry: journalEntryText || `Facial analysis on ${new Date().toLocaleString()}`,
        mood: result.data.mood,
        mentalSolution: result.data.mentalSolution,
        physicalActivity: result.data.physicalActivity,
        emergencyMessage: result.data.emergencyMessage,
      };

      // Optimistic UI update
      const optimisticEntry: JournalEntry = {
        ...newEntryData,
        id: `optimistic-${Date.now()}`,
        createdAt: new Date(),
      };
      setEntries(prevEntries => [optimisticEntry, ...prevEntries]);

      saveJournalEntry(newEntryData).then(saveResult => {
        if (!saveResult.success) {
           toast({
              variant: 'destructive',
              title: 'Database Error',
              description: saveResult.error,
          });
          // Revert optimistic update on failure
          setEntries(prevEntries => prevEntries.filter(e => e.id !== optimisticEntry.id));
        } else {
            // Optionally, you could re-fetch to get the real ID and timestamp,
            // but for a faster UI, we can just continue with the optimistic one.
            // For this app, the optimistic data is sufficient.
            getJournalEntries().then(setEntries); // Refresh list with real data from DB
        }
      });
    }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookText className="h-7 w-7 text-primary" />
            <h1 className="font-headline text-2xl font-bold">Mental Health AI Companion</h1>
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
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <JournalForm
              onSubmit={(data) => handleSubmit(analyzeEntry(data.journalEntry), data.journalEntry)}
              isSubmitting={isSubmitting}
            />
            <FacialAnalysis onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            <MoodResult result={currentResult} isLoading={isSubmitting} />
          </div>
          <div className="lg:col-span-2">
            <PastEntriesList entries={entries} />
          </div>
        </div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Your personal space for reflection and growth.</p>
      </footer>
    </div>
  );
}
