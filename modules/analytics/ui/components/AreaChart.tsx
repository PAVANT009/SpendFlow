"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
    label: "Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaDefault() {
  const [barData, setBarData] = useState<BarData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("api/subscriptions/category-by-month")
      const data = await res.json()
      setBarData(data)
    }
    fetchData()
  }, [])

const chartData = useMemo(() => {
  if (!barData.length) return []

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const grouped: Record<string, MonthChartRow> = {}

  barData.forEach((item) => {
    const monthKey = `${monthNames[item.month - 1]} ${item.year}`
    if (!grouped[monthKey]) {
      grouped[monthKey] = { month: monthKey, total: 0 }
    }
    grouped[monthKey].total += item.count
  })

  return Object.values(grouped)
}, [barData])


  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Activity</CardTitle>
        <CardDescription>Showing total expense count by month</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="total"
              type="natural"
              fill="var(--color-total)"
              fillOpacity={0.4}
              stroke="var(--color-total)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">Recent months</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
