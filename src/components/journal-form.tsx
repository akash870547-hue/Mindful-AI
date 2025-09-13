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
import { Loader2, Mic, MicOff } from 'lucide-react';
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

// Add this type definition for SpeechRecognition
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Silently fail if not supported, the button just won't be shown
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = form.getValues('journalEntry') || '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      form.setValue('journalEntry', finalTranscript + interimTranscript, { shouldValidate: true });
    };

    recognition.onerror = (event: any) => {
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
  }, [form, toast]);


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
      // Clear previous entry before starting a new recording
      form.reset({ journalEntry: '' });
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };


  const handleFormSubmit = (data: JournalFormValues) => {
    onSubmit(data);
    if(isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
    }
    form.reset();
  };

  const isSpeechRecognitionSupported = isClient && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">
          How are you feeling today?
        </CardTitle>
        <CardDescription>
          Let it all out. Your thoughts are safe here.
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
                        placeholder="Write about your day, your thoughts, or anything that's on your mind... or click the mic to speak."
                        className="min-h-[200px] resize-none text-base pr-12"
                        {...field}
                      />
                       {isSpeechRecognitionSupported && (
                        <Button
                            type="button"
                            size="icon"
                            variant={isRecording ? 'destructive' : 'ghost'}
                            className="absolute bottom-3 right-3 rounded-full"
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
            <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6">
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
