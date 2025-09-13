'use client';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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

export function JournalForm({ onSubmit, isSubmitting }: JournalFormProps) {
  const form = useForm<JournalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      journalEntry: '',
    },
  });

  const handleFormSubmit = (data: JournalFormValues) => {
    onSubmit(data);
    form.reset();
  };

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
                    <Textarea
                      placeholder="Write about your day, your thoughts, or anything that's on your mind..."
                      className="min-h-[200px] resize-none text-base"
                      {...field}
                    />
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
