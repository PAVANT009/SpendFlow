"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { useEffect, useMemo, useState } from "react"
import YearMonthToggle, { RangeOption } from "@/modules/analytics/ui/components/YearMonthToggle";
import { Subscription } from "@/types/Subscription"


interface BarData {
  category: string
  year: number
  month: number
  count: number
}

type MonthChartRow = {
  month: string
  total: number
}

  const chartConfig = {
    total: {
      label: "Total Spending"
    }
  };


function toMonthly(amount: number, cycleType: string, cycleCount: number) {
  if (cycleCount <= 0) return amount;  

  switch (cycleType.toLowerCase()) {
    case "year":
      return amount / 12;

    case "month":
      return amount / cycleCount;  

    case "week":
      return (amount * 52) / 12; 

    case "day":
      return (amount * 365) / 12;  

    default:
      return amount;  
  }
}



export function ChartAreaDefault() {
const [chartData, setChartData] = useState<{ month: string; total: number }[]>([]);


useEffect(() => {
  const fetchData = async () => {
    const res = await fetch("/api/subscriptions");
    const subs = await res.json();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const grouped: Record<string, number> = {};

    subs.forEach((sub: Subscription) => {
      const start = new Date(sub.startBilling);
      const monthKey = `${monthNames[start.getMonth()]} ${start.getFullYear()}`;
      const monthlyValue = toMonthly(Number(sub.amount), sub.cycleType, sub.cycleCount);

      if (!Number.isFinite(monthlyValue) || monthlyValue < 0) return;

      grouped[monthKey] = (grouped[monthKey] ?? 0) + monthlyValue;
    });

    const formatted = Object.entries(grouped).map(([month, total]) => ({
      month,
      total: Number((total as number).toFixed(2))
    }));

    formatted.sort((a, b) => {
      const [aMonth, aYear] = a.month.split(" ");
      const [bMonth, bYear] = b.month.split(" ");

      const dateA = new Date(Number(aYear), monthNames.indexOf(aMonth), 1);
      const dateB = new Date(Number(bYear), monthNames.indexOf(bMonth), 1);

      return dateA.getTime() - dateB.getTime();
    });

    setChartData(formatted);
  };

  fetchData();
}, []);


const trend = (
              (
                (chartData[chartData.length - 1]?.total - chartData[chartData.length - 2]?.total) / 
                chartData[chartData.length - 2]?.total ) * 100
                  ).toFixed(0) 


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between ">
        <div>
          <CardTitle className="mb-1">Spending Activity</CardTitle>
          <CardDescription>Showing total expense count by month</CardDescription>
        </div>
        <div >
          {/* <YearMonthToggle value={selected} onChange={setSelected} /> */}
        </div>
      </CardHeader>

      <CardContent >

      <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ left: 25, right: 12 }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="total"
                type="monotone"
                fill="#60a5fa"
                fillOpacity={0.6}
                stroke="#1e40af"
                strokeWidth="3px"
              />
            </AreaChart>
          </ChartContainer>
      </CardContent>

      <CardFooter>
<div className="flex w-full items-start gap-2 text-sm">
  <div className="grid gap-2">
    <div className="flex items-center gap-2 leading-none font-medium">
    {parseInt(trend) > 0 ? (
      <div className="flex flex-row gap-1 items-center">
        <div className="flex flex-row gap-1 items-center">
          <span>Trending</span>
          <span className={`${parseInt(trend) > 0 ? "text-green-600" : "text-red-600"}`}>
            {Math.abs(parseInt(trend))}%
          </span>
          <span>up</span>
        </div>
        <span>this month</span>
        <TrendingUp className="h-4 w-4" />
      </div>
    ) : (
      <div className="flex flex-row gap-1 items-center">
        <div className="flex flex-row gap-1 items-center">
          <span>Trending</span>
          <span className={`${parseInt(trend) > 0 ? "text-green-600" : "text-red-600"}`}>
            {Math.abs(parseInt(trend))}%
          </span>
          <span>down</span>
        </div>
        <span>this month</span>
        <TrendingDown className="h-4 w-4" />
      </div>
    )}

    </div>
    <div className="text-muted-foreground">Last Year</div>
  </div>
  </div>

      </CardFooter>
    </Card>
  )
}
