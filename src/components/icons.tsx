import { Smile, Meh, Frown, LucideProps } from 'lucide-react';

export const MoodIcons = {
  Mild: (props: LucideProps) => <Smile {...props} />,
  Moderate: (props: LucideProps) => <Meh {...props} />,
  Severe: (props: LucideProps) => <Frown {...props} />,
};

export type Mood = keyof typeof MoodIcons;
