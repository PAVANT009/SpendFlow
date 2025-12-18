"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState, useMemo } from "react"
import { useCurrency } from "@/currency-context"
import { currencyOptions } from "@/data/currency-options"

export const description = "A stacked bar chart with subscription categories"

interface BarData {
  category: string
  year: number
  month: number
  count: number
}

interface HighCat {
  category: string;
  amount: number;
}

interface BarResponse {
  data: BarData[];
  highCat: HighCat ;
}

type MonthData = {
  month: string;
  [category: string]: string | number; 
};

export function ChartBarStacked() {
  const [barData, setBardata] = useState<BarResponse | null>(null);

  useEffect(() => {
    const fetchData = async() => {
      const res = await fetch("api/subscriptions/category-by-month");
      const data = await res.json();
      setBardata(data);
    }
    fetchData();
  }, [])

  const { transformedData, dynamicChartConfig } = useMemo(() => {
    if (barData?.data.length === 0) {
      return { transformedData: [], dynamicChartConfig: {} };
    }

    // Transform data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataByMonth: Record<string, MonthData> = {};
    const allCategories = new Set<string>();

    barData?.data.forEach(item => {
      const monthKey = `${monthNames[item.month - 1]} ${item.year}`;
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = { month: monthKey };
      }
      dataByMonth[monthKey][item.category] = item.count;
      allCategories.add(item.category);
    });

    const transformed = Object.values(dataByMonth);

      const colors = [
        "#a855f7", 
        "#22c55e", 
        "#3b82f6", 
        "#eab308", 
        "#f97316", 
        "#ec4899", 
      ]

    const config: ChartConfig = {};
    Array.from(allCategories).forEach((category, index) => {
      config[category] = {
        label: category,
        color: colors[index % colors.length],
      };
    });
    return { transformedData: transformed, dynamicChartConfig: config };
  }, [barData]);

  console.log(transformedData);

  const { convert, currency } = useCurrency();

  return (
    <Card className="w-[50%] border border-border">
      <CardHeader>
        <CardTitle>Subscription Categories by Month</CardTitle>
        <CardDescription>Showing subscription distribution across categories</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={dynamicChartConfig}>
          <BarChart accessibilityLayer data={transformedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={ <ChartLegendContent payload={[]}/>} />
            {Object.keys(dynamicChartConfig).map((category) => {
              return(
                <Bar
                barSize={20}
                key={category}
                dataKey={category}
                stackId="a"
                fill={dynamicChartConfig[category].color}
                radius={  [0, 0, 0, 0]}
                />
              )
            }
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {transformedData.length > 0 && (
          <>
            <div className="flex items-center gap-2 font-medium leading-none">
              Most expensive: {barData?.highCat.category}
            </div>
            <div className="leading-none text-muted-foreground">
              {currencyOptions.find(c => c.value === currency)?.symbol}
              {convert(barData?.highCat.amount ?? 0)}/month
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}