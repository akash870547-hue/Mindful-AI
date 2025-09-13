'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookText } from 'lucide-react';
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
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Your personal space for reflection and growth.</p>
      </footer>
    </div>
  );
}
