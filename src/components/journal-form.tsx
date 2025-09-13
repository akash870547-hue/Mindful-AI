'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2, Mic, MicOff, BookHeart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  journalEntry: z.string().min(10, {
    message: 'Please write at least 10 characters to express yourself.',
  }),
});

type JournalFormValues = z.infer<typeof formSchema>;

interface JournalFormProps {
  onSubmit: (data: JournalFormValues) => void;
  isSubmitting: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function JournalForm({ onSubmit, isSubmitting }: JournalFormProps) {
  const form = useForm<JournalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      journalEntry: '',
    },
  });
  const { toast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!isClient || !SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      form.setValue('journalEntry', finalTranscriptRef.current + interimTranscript, { shouldValidate: true });
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setIsRecording(false);
        return;
      }
      
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isClient, form, toast]);


  const toggleRecording = () => {
    const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    if (!recognitionRef.current || !isSpeechRecognitionSupported) {
        toast({
            variant: 'destructive',
            title: 'Not Supported',
            description: 'Speech recognition is not supported in this browser.',
        });
        return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      finalTranscriptRef.current = '';
      form.reset({ journalEntry: '' });
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };


  const handleFormSubmit = (data: JournalFormValues) => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    finalTranscriptRef.current = '';
    onSubmit(data);
    form.reset();
  };

  const isSpeechRecognitionSupported = isClient && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  return (
    <Card className="shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-3">
          <BookHeart className="h-8 w-8 text-primary" />
          How are you feeling today?
        </CardTitle>
        <CardDescription>
          Let it all out. Your thoughts are safe here. Use your voice or keyboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="journalEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Your journal entry</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Write about your day, your thoughts, or anything that's on your mind..."
                        className="min-h-[200px] resize-none text-base pr-14 py-4 pl-4"
                        {...field}
                      />
                       {isSpeechRecognitionSupported && (
                        <Button
                            type="button"
                            size="icon"
                            variant={isRecording ? 'destructive' : 'ghost'}
                            className="absolute bottom-3 right-3 rounded-full w-10 h-10"
                            onClick={toggleRecording}
                        >
                            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
                        </Button>
                       )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-7">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get My Mood Analysis'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
