'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Mood, MoodIcons } from '@/components/icons';
import { AnalyzeMoodOutput } from '@/lib/types';
import { Lightbulb, Volume2, Loader2, StopCircle, HeartPulse, Brain, TriangleAlert } from 'lucide-react';
import { getSpeech } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  async function handlePlayAudio() {
    if (!result) return;

    if (audioRef.current && audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    setIsGeneratingSpeech(true);
    let textToRead = `Your mood has been analyzed as ${result.mood}. Here is a mental solution for you: ${result.mentalSolution}. And a physical activity you could try: ${result.physicalActivity}.`;
    if (result.mood === 'Severe' && result.emergencyMessage) {
      textToRead += ` Also, please listen to this important message: ${result.emergencyMessage}`;
    }
    const speechResult = await getSpeech(textToRead);
    setIsGeneratingSpeech(false);

    if (speechResult.error) {
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: speechResult.error,
      });
    } else if (speechResult.data) {
      if (audioRef.current) {
        audioRef.current.src = speechResult.data.audioDataUri;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }

  const mood = result?.mood as Mood;
  const Icon = result ? MoodIcons[mood] : null;

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      {isLoading ? (
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
      ) : !result || !Icon ? (
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
      ) : (
        <Card className="bg-accent/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
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
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePlayAudio}
                disabled={isGeneratingSpeech}
                className="h-12 w-12 shrink-0 rounded-full"
              >
                {isGeneratingSpeech ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : isPlaying ? (
                  <StopCircle className="h-7 w-7" />
                ) : (
                  <Volume2 className="h-7 w-7" />
                )}
                <span className="sr-only">Read analysis aloud</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.mood === 'Severe' && result.emergencyMessage && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Important Message</AlertTitle>
                <AlertDescription>
                  {result.emergencyMessage}
                </AlertDescription>
              </Alert>
            )}
            <div className='grid gap-4 md:grid-cols-2'>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-headline text-xl font-semibold">
                  <Brain className="h-6 w-6 text-primary" />
                  Mental Solution
                </h3>
                <p className="leading-relaxed text-card-foreground/90">
                  {result.mentalSolution}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="mb-2 flex items-center gap-2 font-headline text-xl font-semibold">
                  <HeartPulse className="h-6 w-6 text-primary" />
                  Physical Activity
                </h3>
                <p className="leading-relaxed text-card-foreground/90">
                  {result.physicalActivity}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
