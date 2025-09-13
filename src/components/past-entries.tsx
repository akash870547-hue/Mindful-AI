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

interface PastEntriesListProps {
  entries: JournalEntry[];
}

const moodTextClass: Record<Mood, string> = {
  Mild: 'text-chart-2',
  Moderate: 'text-chart-4',
  Severe: 'text-chart-1',
};

export function PastEntriesList({ entries }: PastEntriesListProps) {
  return (
    <Card className="h-full shadow-lg">
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
          <Accordion type="single" collapsible className="w-full">
            {entries.map(entry => {
              const mood = entry.mood as Mood;
              const Icon = MoodIcons[mood];
              return (
                <AccordionItem value={entry.id} key={entry.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-4">
                      <Icon className={`h-6 w-6 shrink-0 ${moodTextClass[mood]}`} />
                      <div className="text-left">
                        <p className="font-semibold">
                          {format(entry.createdAt, 'MMMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mood: {mood}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="mb-1 font-headline text-lg font-semibold">
                        Your Entry
                      </h4>
                      <p className="leading-relaxed text-muted-foreground">
                        {entry.journalEntry}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-headline text-lg font-semibold">
                        Suggested Tip
                      </h4>
                      <p className="leading-relaxed text-muted-foreground">
                        {entry.copingTip}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">No entries yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
