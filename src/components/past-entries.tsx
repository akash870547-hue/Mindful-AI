
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { JournalEntry } from '@/lib/types';
import { Mood, MoodIcons } from '@/components/icons';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PastEntriesListProps {
  entries: JournalEntry[];
}

const moodTextClass: Record<string, string> = {
  Happy: 'text-green-600',
  Calm: 'text-blue-600',
  Sad: 'text-gray-600',
  Anxious: 'text-yellow-600',
  Angry: 'text-red-600',
  Grateful: 'text-purple-600',
  Stressed: 'text-orange-600',
  Tired: 'text-indigo-600',
  Overwhelmed: 'text-pink-600',
  'No Face Detected': 'text-gray-600',
  Mild: 'text-green-600',
  Moderate: 'text-yellow-600',
  Severe: 'text-red-600',
};

export function PastEntriesList({ entries }: PastEntriesListProps) {
  const reversedEntries = [...entries].reverse();
  
  return (
    <Card className="h-full shadow-lg backdrop-blur-sm bg-card/80 sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Previous Entries</CardTitle>
        <CardDescription>
          {entries.length > 0
            ? 'A log of your mental wellness journey.'
            : 'Your past journal entries will appear here.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <ScrollArea className="h-[60vh] pr-4">
            <Accordion type="single" collapsible className="w-full">
              {reversedEntries.map(entry => {
                const mood = entry.mood as Mood;
                const Icon = MoodIcons[mood];
                return (
                  <AccordionItem value={entry.id} key={entry.id} className="border-b-border/70">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4 w-full">
                        {Icon && <Icon className={`h-6 w-6 shrink-0 ${moodTextClass[mood]}`} />}
                        <div className="text-left flex-1">
                          <p className="font-semibold">
                            {format(entry.createdAt, 'MMMM d, yyyy')}
                          </p>
                          <p className={`text-sm font-medium ${moodTextClass[mood]}`}>
                            Mood: {mood}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 text-base">
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        <h4 className="mb-1 font-headline text-lg font-semibold text-foreground">
                          Your Entry
                        </h4>
                        <p className="leading-relaxed">
                          {entry.journalEntry}
                        </p>
                      </div>
                      {entry.mentalSolution && (
                       <div className="prose prose-sm max-w-none text-muted-foreground">
                        <h4 className="mb-1 font-headline text-lg font-semibold text-foreground">
                          Mental Solution
                        </h4>
                        <p className="leading-relaxed">
                          {entry.mentalSolution}
                        </p>
                      </div>
                      )}
                      {entry.physicalActivity && (
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        <h4 className="mb-1 font-headline text-lg font-semibold text-foreground">
                          Physical Activity
                        </h4>
                        <p className="leading-relaxed">
                          {entry.physicalActivity}
                        </p>
                      </div>
                      )}
                      {entry.emergencyMessage && (
                         <div className="prose prose-sm max-w-none text-destructive/80">
                          <h4 className="mb-1 font-headline text-lg font-semibold text-destructive">
                            Important Message
                          </h4>
                          <p className="leading-relaxed">
                            {entry.emergencyMessage}
                          </p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">No entries yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
