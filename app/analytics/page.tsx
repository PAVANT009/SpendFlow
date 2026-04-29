"use client";

import AlertSection from "@/modules/analytics/ui/components/AlertSection";
import { ChartAreaDefault } from "@/modules/analytics/ui/components/AreaChart";
import { ChartBarStacked } from "@/modules/analytics/ui/components/BarChart";
import { ChartPieDonut } from "@/modules/analytics/ui/components/PieChart";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/Subscription";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export const description = "A donut chart"
const colors = [
  "#a855f7", 
  "#22c55e", 
  "#3b82f6", 
  "#eab308", 
  "#f97316", 
  "#ec4899", 
]

interface Categorystat {
  category: string;
  subscriptionCount: number | undefined;
  totalMonthly?: number;
}
export interface PieChartData {
  category: string;
  subscriptionCount: number;
  fill: string;
  [key: string]: string | number; 
}

const categories = [
  "Entertainment",
  "Productivity",
  "Health & Fitness",
  "Development",
  "Cloud",
  "Learning",
];

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

function escapeCsv(value: string) {
  if (value.includes("\"")) {
    value = value.replace(/"/g, "\"\"");
  }

  if (value.includes(",") || value.includes("\n") || value.includes("\r")) {
    return `"${value}"`;
  }

  return value;
}

export default function Page() {
  const [analyticData, setAnalyticData] = useState<Categorystat[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const results: Categorystat[] = [];

      for (const cat of categories) {
        const res = await fetch(`/api/subscriptions/stats/${cat}`);
        const data = await res.json();
        results.push(data);
      }

      setAnalyticData(results);
    };

    fetchData();
  }, []);

  const chartData: PieChartData[] = analyticData.map((item, index) => ({
    category: item.category,
    subscriptionCount: item.totalMonthly ?? 0,
    fill: colors[index] ?? "#ec4899",
  }));

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const res = await fetch("/api/subscriptions");
      const subs: Subscription[] = await res.json();

      const rows = subs.map((sub) => {
        const monthlyAmount = toMonthly(
          Number(sub.amount),
          sub.cycleType,
          sub.cycleCount
        );

        return {
          name: sub.name,
          category: sub.category,
          amount: sub.amount,
          currency: sub.currency,
          cycleType: sub.cycleType,
          cycleCount: sub.cycleCount,
          monthlyAmount: monthlyAmount.toFixed(2),
          startBilling: sub.startBilling,
          nextBilling: sub.nextBilling,
          reminder: sub.reminder ? "true" : "false",
          url: sub.url ?? "",
          notes: sub.notes ?? "",
        };
      });

      const headers = rows.length
        ? Object.keys(rows[0])
        : [
            "name",
            "category",
            "amount",
            "currency",
            "cycleType",
            "cycleCount",
            "monthlyAmount",
            "startBilling",
            "nextBilling",
            "reminder",
            "url",
            "notes",
          ];

      const csvRows = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((header) => escapeCsv(String(row[header as keyof typeof row] ?? "")))
            .join(",")
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="px-7 pt-7 bg-background h-[1300px]">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xl font-semibold">Analytics</div>
          <div className="text-sm text-muted-foreground">
            Monitor spend trends and export your subscription data.
          </div>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={isExporting}>
          <Download className="size-4" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>
      <div>
        <ChartAreaDefault />
      </div>
      <div className="flex sm:flex-row flex-col gap-1.5 mt-4 justify-between">
        <ChartPieDonut chartData={chartData} />
        <ChartBarStacked />
      </div>
      <AlertSection />
    </div>
  );
}
