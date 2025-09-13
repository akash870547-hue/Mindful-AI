import { Smile, Meh, Frown, LucideProps, Angry, Annoyed, HandPlatter } from 'lucide-react';

export const MoodIcons = {
  Happy: (props: LucideProps) => <Smile {...props} />,
  Calm: (props: LucideProps) => <Meh {...props} />,
  Sad: (props: LucideProps) => <Frown {...props} />,
  Anxious: (props: LucideProps) => <Annoyed {...props} />,
  Angry: (props: LucideProps) => <Angry {...props} />,
  // Fallback for old data
  Mild: (props: LucideProps) => <Smile {...props} />,
  Moderate: (props: LucideProps) => <Meh {...props} />,
  Severe: (props: LucideProps) => <Frown {...props} />,
};

export type Mood = keyof typeof MoodIcons;
