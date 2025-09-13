'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookText, BrainCircuit, HeartPulse, Lightbulb, LineChart } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookText className="h-7 w-7 text-primary" />
            <h1 className="font-headline text-2xl font-bold">Mindful AI</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center md:py-24 lg:py-32">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6 lg:text-left">
              <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Your Personal AI Companion for Mental Wellness
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                Mindful AI helps you understand your emotions, one journal entry
                at a time. Write down your thoughts, and our AI will provide
                gentle analysis and coping tips to support your mental wellness
                journey.
              </p>
              <Button asChild size="lg" className="text-lg">
                <Link href="/journal">
                  Start Your Journal <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-2xl lg:h-auto lg:self-stretch">
              <Image
                src="https://picsum.photos/seed/1/600/400"
                alt="A person writing in a journal in a calm setting"
                width={600}
                height={400}
                className="h-full w-full object-cover"
                data-ai-hint="calm journal"
              />
            </div>
          </div>
        </section>
        <section className="bg-muted/40 py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                How Mindful AI Supports You
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover a new way to engage with your thoughts and feelings.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-lg">
                <div className="relative h-48 w-full">
                   <Image
                    src="https://picsum.photos/seed/2/400/300"
                    alt="Abstract representation of mood analysis"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                    data-ai-hint="mood analysis"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <BrainCircuit className="h-6 w-6" />
                    </div>
                    <h4 className="font-headline text-xl font-semibold">AI Mood Analysis</h4>
                  </div>
                  <p className="text-muted-foreground">
                    Our advanced AI reads your journal entries to identify your mood, helping you gain clarity on your emotional state.
                  </p>
                </div>
              </div>
               <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-lg">
                <div className="relative h-48 w-full">
                   <Image
                    src="https://picsum.photos/seed/3/400/300"
                    alt="A lightbulb symbolizing a helpful tip"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                    data-ai-hint="helpful tip"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <h4 className="font-headline text-xl font-semibold">Personalized Tips</h4>
                  </div>
                  <p className="text-muted-foreground">
                    Receive gentle, actionable coping tips tailored to your mood to help you navigate your feelings.
                  </p>
                </div>
              </div>
              <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-lg">
                <div className="relative h-48 w-full">
                   <Image
                    src="https://picsum.photos/seed/4/400/300"
                    alt="A chart showing progress over time"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                    data-ai-hint="progress chart"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <h4 className="font-headline text-xl font-semibold">Track Your Journey</h4>
                  </div>
                  <p className="text-muted-foreground">
                    Look back on previous entries and visualize your emotional patterns and progress over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Your personal space for reflection and growth.</p>
      </footer>
    </div>
  );
}
