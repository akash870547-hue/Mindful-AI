'use client';

import { useState, useEffect } from 'react';
import { BookText } from 'lucide-react';
import { JournalForm } from '@/components/journal-form';
import { MoodResult } from '@/components/mood-result';
import { PastEntriesList } from '@/components/past-entries';
import { analyzeEntry, getJournalEntries, saveJournalEntry } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry } from '@/lib/types';
import type { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood-and-suggest-coping-tip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, LineChart } from 'lucide-react';

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

  async function handleJournalSubmit(data: { journalEntry: string }) {
    setIsSubmitting(true);
    setCurrentResult(null);

    const result = await analyzeEntry(data.journalEntry);
    setIsSubmitting(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: result.error,
      });
    } else if (result.data) {
      setCurrentResult(result.data);
      
      // Now save the entry to the database in the background
      const saveResult = await saveJournalEntry({
        journalEntry: data.journalEntry,
        mood: result.data.mood,
        copingTip: result.data.copingTip,
      });

      if (saveResult.success) {
        // Refresh entries from the database
        const fetchedEntries = await getJournalEntries();
        setEntries(fetchedEntries);
      } else {
         toast({
            variant: 'destructive',
            title: 'Database Error',
            description: saveResult.error,
        });
      }
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
              onSubmit={handleJournalSubmit}
              isSubmitting={isSubmitting}
            />
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
