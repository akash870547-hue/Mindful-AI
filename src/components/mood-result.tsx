import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mood, MoodIcons } from '@/components/icons';
import { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood-and-suggest-coping-tip';
import { Lightbulb } from 'lucide-react';

interface MoodResultProps {
  result: AnalyzeMoodOutput | null;
  isLoading: boolean;
}

const moodTextClass: Record<Mood, string> = {
  Mild: 'text-chart-2',
  Moderate: 'text-chart-4',
  Severe: 'text-chart-1',
};

export function MoodResult({ result, isLoading }: MoodResultProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex min-h-[260px] flex-col items-center justify-center border-2 border-dashed bg-transparent text-center shadow-none">
        <CardHeader>
          <CardTitle className="font-headline text-muted-foreground">
            Your Analysis Appears Here
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Submit a journal entry and I'll help you understand your mood.
          </p>
        </CardContent>
      </Card>
    );
  }

  const mood = result.mood as Mood;
  const Icon = MoodIcons[mood];

  return (
    <Card className="bg-accent/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Icon className={`h-10 w-10 shrink-0 ${moodTextClass[mood]}`} />
          <div>
            <CardTitle className="font-headline text-3xl">
              Analysis: <span className={moodTextClass[mood]}>{mood}</span>
            </CardTitle>
            <CardDescription>
              Here's what I gathered from your entry.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-headline text-xl font-semibold">
            <Lightbulb className="h-6 w-6 text-primary" />
            Coping Tip
          </h3>
          <p className="leading-relaxed text-card-foreground/90">
            {result.copingTip}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
