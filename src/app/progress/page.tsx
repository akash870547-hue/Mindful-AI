
'use client';

import { useState, useEffect } from 'react';
import { BookText, HomeIcon, TrendingUp, BarChart4 } from 'lucide-react';
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
import { ThemeToggle } from '@/components/theme-toggle';
import { Mood, MoodIcons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

const mockEntries: JournalEntry[] = [
  { id: '1', journalEntry: "Feeling great today! Went for a walk and saw a beautiful sunset.", mood: 'Happy', moodScore: 85, createdAt: new Date('2024-09-15T09:00:00Z'), mentalSolution: null, physicalActivity: null, quote: null },
  { id: '2', journalEntry: "A bit stressed with work deadlines. Feeling the pressure.", mood: 'Stressed', moodScore: 70, createdAt: new Date('2024-09-16T14:30:00Z'), mentalSolution: null, physicalActivity: null, quote: null },
  { id: '3', journalEntry: "Had a calm and relaxing evening. Meditated for 10 minutes.", mood: 'Calm', moodScore: 30, createdAt: new Date('2024-09-17T21:00:00Z'), mentalSolution: null, physicalActivity: null, quote: null },
  { id: '4', journalEntry: "Feeling anxious about the presentation tomorrow.", mood: 'Anxious', moodScore: 75, createdAt: new Date('2024-09-18T18:00:00Z'), mentalSolution: null, physicalActivity: null, quote: null },
  { id: '5', journalEntry: "Feeling sad for no real reason. Just one of those days.", mood: 'Sad', moodScore: 60, createdAt: new Date('2024-09-19T11:00:00Z'), mentalSolution: null, physicalActivity: null, quote: null },
  { id: '6', journalEntry: "So grateful for my friends. Had a wonderful call with my best friend.", mood: 'Grateful', moodScore: 20, createdAt: new Date('2024-09-20T20:00:00Z'), mentalSolution: null, physicalActivity: null, quote: null },
  { id: '7', journalEntry: "Productive day today! Feeling accomplished and happy.", mood: 'Happy', moodScore: 90, createdAt: new Date('2024-09-21T17:00:00Z'), mentalSolution: null, physicalActivity: null, quote: null },
];


function getDashboardStats(entries: JournalEntry[]) {
    if (entries.length === 0) {
        return {
            totalEntries: 0,
            averageMoodScore: 0,
            mostFrequentMood: null,
        };
    }

    const totalEntries = entries.length;
    const averageMoodScore = Math.round(entries.reduce((sum, entry) => sum + (entry.moodScore ?? 0), 0) / totalEntries);
    
    const moodCounts = entries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, '' as Mood | '');

    return { totalEntries, averageMoodScore, mostFrequentMood };
}


export default function ProgressPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      setIsLoading(true);
      const fetchedEntries = await getJournalEntries();
      if (fetchedEntries.length > 0) {
        setEntries(fetchedEntries);
      } else {
        setEntries(mockEntries);
      }
      setIsLoading(false);
    }
    loadEntries();
  }, []);

  const { totalEntries, averageMoodScore, mostFrequentMood } = getDashboardStats(entries);
  const MostFrequentMoodIcon = mostFrequentMood ? MoodIcons[mostFrequentMood as Mood] : null;

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookText className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold">Mental Health AI Companion</h1>
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
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
            Your Wellness Dashboard
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <BookText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalEntries}</div>}
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Mood Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{averageMoodScore} %</div>}
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Frequent Mood</CardTitle>
                 {MostFrequentMoodIcon ? <MostFrequentMoodIcon className="h-4 w-4 text-muted-foreground" /> : <BarChart4 className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{mostFrequentMood || 'N/A'}</div>}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Mood Intensity Over Time</CardTitle>
              <CardDescription>
                Visualize your mood score fluctuations across your journal entries.
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
