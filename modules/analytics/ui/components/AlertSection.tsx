"use client";

import { Subscription } from "@/types/Subscription";
import { useEffect, useState } from "react";

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

interface HighestSubData {
  name: string;
  category: string;
  monthlyValue: number;
  raw?: Subscription;
}

export default function AlertSection() {
  const [highestSubscription, setHighestSubscription] = useState<HighestSubData | null>(null);
  const [topCategory, setTopCategory] = useState<{ category: string; count: number } | null>(null);

  // FIX: state should be string only
  const [insight, setInsight] = useState<string>("Loading AI insights...");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/subscriptions");
      const subs = await res.json();

      let highestSub: HighestSubData | null = null;
      let highestMonthlyValue = 0;
      const categoryCount: Record<string, number> = {};

      subs.forEach((sub: Subscription) => {
        const monthlyValue = toMonthly(
          Number(sub.amount),
          sub.cycleType,
          sub.cycleCount
        );

        if (monthlyValue > highestMonthlyValue) {
          highestMonthlyValue = monthlyValue;
          highestSub = {
            name: sub.name,
            category: sub.category,
            monthlyValue,
          };
        }

        categoryCount[sub.category] = (categoryCount[sub.category] ?? 0) + 1;
      });

      let maxCategory = null;
      let maxCount = 0;
      for (const cat in categoryCount) {
        if (categoryCount[cat] > maxCount) {
          maxCategory = cat;
          maxCount = categoryCount[cat];
        }
      }

      setHighestSubscription(highestSub);
      setTopCategory(maxCategory ? { category: maxCategory, count: maxCount } : null);

        const data = await getInsights(subs);

        console.log("AI Insight:", data);

        // FIX: pick **string** field — adjust to your API response
        setInsight(data.result || data.suggestion || "No insight found");
      
    };

    async function getInsights(subscription: HighestSubData) {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      return res.json();
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-3 bg-card px-4 py-2 rounded-2xl mt-4 border border-border">
      <div>
        <div className="text-card-foreground mt-1.5 font-semibold">Insights & Recommendations</div>
        <div className="text-muted-foreground text-sm">Based on your subscription patterns</div>
      </div>

      <div className="bg-red-900/10 p-4 border border-red-700 shadow rounded-2xl">
        <div className="text-foreground text-[10px] font-semibold mb-1 bg-red-600 w-fit px-2 py-1 rounded-2xl">Category</div>
        <div className="font-semibold">
          {topCategory ? `${topCategory.category} (${topCategory.count} subscriptions)` : "Loading..."}
        </div>
      </div>

      <div className="p-4 border shadow rounded-2xl">
        <div className="text-foreground text-[10px] font-semibold mb-1 bg-red-600 w-fit px-2 py-1 rounded-2xl">Cost</div>
        <div className="font-semibold">
          {highestSubscription
            ? `${highestSubscription.name} — ₹${highestSubscription.monthlyValue.toFixed(0)}/month`
            : "Loading..."}
        </div>
      </div>

      <div className="p-4 border shadow rounded-2xl bg-green-900/10">
        <div className="text-foreground text-[10px] font-semibold mb-1 bg-green-600 w-fit px-2 py-1 rounded-2xl">AI Insight</div>
        <div className="font-medium">{insight}</div>
      </div>
    </div>
  );
}
