
'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { JournalEntry } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';

interface MoodChartProps {
  data: JournalEntry[];
  isLoading: boolean;
}

const chartConfig = {
  moodScore: {
    label: 'Mood Score',
    color: 'hsl(var(--primary))',
  },
};

export function MoodChart({ data, isLoading }: MoodChartProps) {
  const chartData = data
    .filter(entry => entry.moodScore !== undefined)
    .map(entry => ({
        date: format(new Date(entry.createdAt), 'MMM d'),
        moodScore: entry.moodScore,
        mood: entry.mood,
    }));

  if (isLoading) {
    return (
        <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
        </div>
    )
  }

  if (!chartData || chartData.length < 2) {
    return (
        <div className="flex h-[350px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">Not enough data to display a chart.</p>
            <p className="text-sm text-muted-foreground">Make at least two journal entries to see your progress.</p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            top: 10,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={value => value}
          />
           <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => value}
                formatter={(value, name, props) => (
                    <div>
                        <p>Score: {value}%</p>
                        <p>Mood: {props.payload.mood}</p>
                    </div>
                )}
                indicator="dot"
              />
            }
          />
          <defs>
            <linearGradient id="fillMood" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-moodScore)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-moodScore)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="moodScore"
            type="monotone"
            fill="url(#fillMood)"
            stroke="var(--color-moodScore)"
            stackId="a"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
