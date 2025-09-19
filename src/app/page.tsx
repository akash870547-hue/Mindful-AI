'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookText, BrainCircuit, Lightbulb, LineChart } from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

const FeatureCard = ({ href, icon: Icon, title, children }: { href: string; icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <Link href={href} className="group block">
    <div className="relative h-full transform overflow-hidden rounded-xl border bg-card/80 shadow-lg transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl backdrop-blur-sm">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3 text-primary ring-2 ring-primary/20">
            <Icon className="h-6 w-6" />
          </div>
          <h4 className="font-headline text-xl font-semibold">{title}</h4>
        </div>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </div>
  </Link>
);


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookText className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl md:text-3xl font-bold">Mental Health AI Companion</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
           <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
                <div className="absolute h-[300px] w-[300px] rounded-full bg-primary/50 blur-3xl -translate-x-1/2 -translate-y-1/2 top-1/4 left-1/4"></div>
                <div className="absolute h-[300px] w-[300px] rounded-full bg-accent/50 blur-3xl translate-x-1/2 translate-y-1/2 bottom-1/4 right-1/4"></div>
            </div>
          <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6 text-center">
              <h2 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
                Your Space for Reflection and Growth
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground md:text-xl">
                Understand your emotions, one journal entry at a time. Write or speak your thoughts, and our AI will provide gentle analysis and coping tips to support your mental wellness journey.
              </p>
              <Button asChild size="lg" className="text-lg h-14 px-10">
                <Link href="/journal">
                  Start Your Journal <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="bg-muted/30 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                How This App Supports You
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover a new way to engage with your thoughts and feelings.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
               <FeatureCard 
                  href="/journal"
                  icon={BrainCircuit}
                  title="AI Mood Analysis">
                    Our advanced AI reads your journal entries to identify your mood, helping you gain clarity on your emotional state.
               </FeatureCard>

               <FeatureCard
                  href="/journal"
                  icon={Lightbulb}
                  title="Personalized Tips">
                  Receive gentle, actionable coping tips tailored to your mood to help you navigate your feelings.
               </FeatureCard>
               
               <FeatureCard
                  href="/progress"
                  icon={LineChart}
                  title="Track Your Journey">
                  Look back on previous entries and visualize your emotional patterns and progress over time.
                </FeatureCard>
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
