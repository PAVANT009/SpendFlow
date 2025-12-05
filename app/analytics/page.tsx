"use client";

import AlertSection from "@/modules/analytics/ui/components/AlertSection";
import { ChartAreaDefault } from "@/modules/analytics/ui/components/AreaChart";
import { ChartBarStacked } from "@/modules/analytics/ui/components/BarChart";
import { ChartPieDonut } from "@/modules/analytics/ui/components/PieChart";
import React, { useEffect, useState } from "react";

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

export default function Page() {
      const [analyticData,setAnalyticData] = useState<Categorystat[]>([]);
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

  return (
    <div className="px-7 pt-7  bg-background h-[1300px]">
      <div >
        <ChartAreaDefault/>
      </div>
      <div className="flex flex-row mt-4 justify-between">
        <ChartPieDonut chartData = {chartData}/>
        <ChartBarStacked/>
      </div>
      <AlertSection/>
    </div>
  );
}
