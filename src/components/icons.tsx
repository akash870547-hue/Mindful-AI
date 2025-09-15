import { Smile, Meh, Frown, LucideProps, Angry, Annoyed, HandPlatter, Hand, Wind, BatteryFull, BrainCircuit, Waves, UserX } from 'lucide-react';

export const MoodIcons = {
  Happy: (props: LucideProps) => <Smile {...props} />,
  Calm: (props: LucideProps) => <Waves {...props} />,
  Sad: (props: LucideProps) => <Frown {...props} />,
  Anxious: (props: LucideProps) => <Annoyed {...props} />,
  Angry: (props: LucideProps) => <Angry {...props} />,
  Grateful: (props: LucideProps) => <HandPlatter {...props} />,
  Stressed: (props: LucideProps) => <Wind {...props} />,
  Tired: (props: LucideProps) => <BatteryFull {...props} className="rotate-90" />,
  Overwhelmed: (props: LucideProps) => <BrainCircuit {...props} />,
  'No Face Detected': (props: LucideProps) => <UserX {...props} />,
  // Fallback for old data
  Mild: (props: LucideProps) => <Smile {...props} />,
  Moderate: (props: LucideProps) => <Meh {...props} />,
  Severe: (props: LucideProps) => <Frown {...props} />,
};

export type Mood = keyof typeof MoodIcons;
