'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const moodToValue: Record<string, number> = {
  Mild: 1,
  Moderate: 2,
  Severe: 3,
};

const valueToMood: Record<number, string> = {
  1: 'Mild',
  2: 'Moderate',
  3: 'Severe',
};

const chartConfig = {
  mood: {
    label: 'Mood',
  },
  mild: {
    label: 'Mild',
    color: 'hsl(var(--chart-2))',
  },
  moderate: {
    label: 'Moderate',
    color: 'hsl(var(--chart-4))',
  },
  severe: {
    label: 'Severe',
    color: 'hsl(var(--chart-1))',
  },
};

export function MoodChart({ data, isLoading }: MoodChartProps) {
  const chartData = data.map(entry => ({
    date: format(entry.createdAt, 'MMM d'),
    mood: moodToValue[entry.mood],
  }));

  if (isLoading) {
    return (
        <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
        </div>
    )
  }

  if (!data || data.length < 2) {
    return (
        <div className="flex h-[350px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">Not enough data to display a chart.</p>
            <p className="text-sm text-muted-foreground">Make a few more journal entries.</p>
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
          <CartesianGrid vertical={false} />
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
            domain={[0.5, 3.5]}
            ticks={[1, 2, 3]}
            tickFormatter={(value) => valueToMood[value] || ''}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                        return payload[0].payload.date;
                    }
                    return label;
                }}
                formatter={(value) => valueToMood[value as number]}
                indicator="dot"
              />
            }
          />
          <defs>
            <linearGradient id="fillMood" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-severe)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mild)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="mood"
            type="monotone"
            fill="url(#fillMood)"
            stroke="var(--color-mood)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
