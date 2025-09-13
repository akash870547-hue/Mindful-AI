'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookText, BrainCircuit, Lightbulb, LineChart } from 'lucide-react';
import Image from 'next/image';

const FeatureCard = ({ href, imgSrc, imgAlt, imgHint, icon: Icon, title, children }: { href: string; imgSrc: string; imgAlt: string; imgHint: string; icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <Link href={href} className="group block">
    <div className="relative h-full transform overflow-hidden rounded-xl border bg-card/80 shadow-lg transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl backdrop-blur-sm">
      <div className="relative h-48 w-full">
        <Image
          src={imgSrc}
          alt={imgAlt}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={imgHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
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
            <h1 className="font-headline text-3xl font-bold">Mental Health AI Companion</h1>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
           <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute h-[300px] w-[300px] rounded-full bg-primary/50 blur-3xl -translate-x-1/2 -translate-y-1/2 top-1/4 left-1/4"></div>
                <div className="absolute h-[300px] w-[300px] rounded-full bg-accent/50 blur-3xl translate-x-1/2 translate-y-1/2 bottom-1/4 right-1/4"></div>
            </div>
          <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="space-y-6 text-left">
                <h2 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
                  Your Space for Reflection and Growth
                </h2>
                <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                  Understand your emotions, one journal entry at a time. Write or speak your thoughts, and our AI will provide gentle analysis and coping tips to support your mental wellness journey.
                </p>
                <Button asChild size="lg" className="text-lg h-14 px-10">
                  <Link href="/journal">
                    Start Your Journal <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-2xl lg:h-[28rem]">
                <Image
                  src="https://picsum.photos/seed/10/600/400"
                  alt="A serene image representing mental clarity and peace"
                  fill
                  className="object-cover"
                  data-ai-hint="serene mind"
                />
                 <div className="absolute inset-0 bg-gradient-to-tr from-background/10 via-transparent to-background/10" />
              </div>
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
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
               <FeatureCard 
                  href="/journal"
                  imgSrc="https://picsum.photos/seed/2/400/300"
                  imgAlt="Abstract representation of mood analysis"
                  imgHint="mood analysis"
                  icon={BrainCircuit}
                  title="AI Mood Analysis">
                    Our advanced AI reads your journal entries to identify your mood, helping you gain clarity on your emotional state.
               </FeatureCard>

               <FeatureCard
                  href="/journal"
                  imgSrc="https://picsum.photos/seed/3/400/300"
                  imgAlt="A lightbulb symbolizing a helpful tip"
                  imgHint="helpful tip"
                  icon={Lightbulb}
                  title="Personalized Tips">
                  Receive gentle, actionable coping tips tailored to your mood to help you navigate your feelings.
               </FeatureCard>
               
               <FeatureCard
                  href="/progress"
                  imgSrc="https://picsum.photos/seed/4/400/300"
                  imgAlt="A chart showing progress over time"
                  imgHint="progress chart"
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
