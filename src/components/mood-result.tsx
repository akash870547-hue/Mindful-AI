
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
import { Volume2, Loader2, StopCircle, HeartPulse, Brain, TriangleAlert } from 'lucide-react';
import { getSpeech } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface MoodResultProps {
  result: AnalyzeMoodOutput | null;
  isLoading: boolean;
}

const moodStyling: Record<string, { text: string, bg: string, border: string, progress: string }> = {
  Happy: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', progress: 'bg-green-500' },
  Calm: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', progress: 'bg-blue-500' },
  Sad: { text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', progress: 'bg-gray-500' },
  Anxious: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', progress: 'bg-yellow-500' },
  Angry: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', progress: 'bg-red-500' },
  // Fallbacks for old data
  Mild: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', progress: 'bg-green-500' },
  Moderate: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', progress: 'bg-yellow-500' },
  Severe: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', progress: 'bg-red-500' },
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
    if (result.emergencyMessage) {
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

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           <Skeleton className="h-24 w-full" />
           <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!result || !Icon) {
    return (
      <Card className="flex min-h-[320px] flex-col items-center justify-center border-2 border-dashed bg-card/50 text-center shadow-none backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-muted-foreground">
            Your Analysis Appears Here
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Submit a journal entry or a facial scan, and I'll help you understand your mood.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const styles = moodStyling[mood];

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <Card className={cn("shadow-xl transition-all duration-300 backdrop-blur-sm", styles.bg, styles.border)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("p-2 rounded-full", styles.bg)}>
                <Icon className={cn("h-10 w-10 shrink-0", styles.text)} />
              </div>
              <div>
                <CardTitle className="font-headline text-3xl">
                  Analysis: <span className={styles.text}>{mood}</span>
                </CardTitle>
                <CardDescription className={cn(styles.text, "opacity-80")}>
                  Here's what I gathered from your input.
                </CardDescription>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePlayAudio}
              disabled={isGeneratingSpeech}
              className={cn("h-12 w-12 shrink-0 rounded-full hover:bg-black/5", styles.text)}
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
        <CardContent className="space-y-6">
           {result.moodScore !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between font-headline text-lg">
                <span className={cn('font-semibold', styles.text)}>Mood Intensity</span>
                <span className={cn('font-bold', styles.text)}>{result.moodScore}%</span>
              </div>
              <Progress value={result.moodScore} className={cn("h-3", styles.progress)} />
            </div>
           )}
          {result.emergencyMessage && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Important Message</AlertTitle>
              <AlertDescription>
                {result.emergencyMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className='grid gap-6'>
            <div className="space-y-2">
              <h3 className="flex items-center gap-3 font-headline text-xl font-semibold">
                <Brain className="h-7 w-7 text-primary" />
                Mental Solution
              </h3>
              <p className="leading-relaxed text-card-foreground/90 pl-10">
                {result.mentalSolution}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="flex items-center gap-3 font-headline text-xl font-semibold">
                <HeartPulse className="h-7 w-7 text-primary" />
                Physical Activity
              </h3>
              <p className="leading-relaxed text-card-foreground/90 pl-10">
                {result.physicalActivity}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
