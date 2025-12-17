"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useCurrency } from "@/currency-context"
import { currencyOptions } from "@/data/currency-options"

export const description = "A donut chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

// interface ChartPieDonutProps {
//   category: string;
//   subscriptionCount: number;
//   fill: string;
// }

export interface PieChartData {
  category: string;
  subscriptionCount: number;
  fill: string;
  [key: string]: string | number; 
}

interface ChartPieDonutProps {
  chartData: PieChartData[];
}


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartPieDonut({ chartData }: { chartData: PieChartData[] }) {
  const chartConfig = Object.fromEntries(
    chartData.map((c) => [
      c.category,
      { label: c.category, color: c.fill }
    ])
  );

  const total = chartData.reduce((sum, c) => sum + c.subscriptionCount, 0);
  console.log(chartConfig,chartData)
    const { convert, currency } = useCurrency();
  

  return (
    <Card className="h-[400px] border border-border">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Monthly spending by category</CardDescription>
      </CardHeader>
<CardContent className="flex justify-center items-center ">
  <ChartContainer
    config={chartConfig}
    className="mx-auto h-[250px] w-[250px]"
  >
    <PieChart>
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      <Pie
        data={chartData}
        dataKey="subscriptionCount"
        nameKey="category"
        innerRadius={60}
      />
    </PieChart>
  </ChartContainer>
</CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Total: {currencyOptions.find(c => c.value === currency)?.symbol} {convert(total)} / year
        </div>
        <div className="text-muted-foreground">Across {chartData.length} categories</div>
      </CardFooter>
    </Card>
  );
}
