'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ImpactChartProps {
  data: {
    highImpact: number;
    lowImpact: number;
  };
}

const chartData = (data: ImpactChartProps['data']) => [
  { type: 'High Impact', count: data.highImpact, fill: 'var(--color-high)' },
  { type: 'Low Impact', count: data.lowImpact, fill: 'var(--color-low)' },
];

const chartConfig = {
  count: {
    label: 'Tasks',
  },
  high: {
    label: 'High Impact',
    color: 'hsl(var(--chart-1))',
  },
  low: {
    label: 'Low Impact',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ImpactChart({ data }: ImpactChartProps) {
  const totalTasks = data.highImpact + data.lowImpact;
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>High-Impact vs. Low-Impact Tasks</CardTitle>
        <CardDescription>Breakdown of completed tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData(data)}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData(data).map((entry) => (
                    <Cell key={`cell-${entry.type}`} fill={entry.fill} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Completed {totalTasks} tasks in total
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing task distribution by impact
        </div>
      </CardFooter>
    </Card>
  );
}
