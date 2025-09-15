
'use client';

import { useState, useEffect } from 'react';
import { BookText, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { JournalEntry } from '@/lib/types';
import { MoodChart } from '@/components/mood-chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getJournalEntries } from '@/app/actions';

export default function ProgressPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      setIsLoading(true);
      const fetchedEntries = await getJournalEntries();
      setEntries(fetchedEntries);
      setIsLoading(false);
    }
    loadEntries();
  }, []);

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
              <Link href="/journal">
                Journal
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
            Your Mood Journey
          </h2>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Mood Over Time</CardTitle>
              <CardDescription>
                Visualize your mood fluctuations over the past entries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodChart data={entries} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Your personal space for reflection and growth.</p>
      </footer>
    </div>
  );
}
