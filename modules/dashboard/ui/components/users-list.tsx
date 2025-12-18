"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, CalendarClock, CreditCard, Currency, IndianRupee, TrendingUp, User } from "lucide-react";
import Card from "./card";
import { Subscription } from "@/types/Subscription";
import { useCurrency } from "@/currency-context";
import { currencyOptions } from "@/data/currency-options";

export default function UsersStats({data,loading} :{data:Subscription[] ,loading: boolean}) {
    const {  convert,currency } = useCurrency();
  const [dashboardData, setDashboardData] = useState<null | {
  activeSubscriptions: number;
  monthlyTotal: number ;
  topCategory: { category: string; monthly: number };
  upcomingRenewalsCount: number;
  nearestRenewal: { id: string; name: string; days: number,amount: number  }
}>(null);
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/subscriptions/stats");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const dataStats = await res.json();

      setDashboardData({
        activeSubscriptions: dataStats?.activeSubscriptions ?? 0,
        monthlyTotal: dataStats?.monthlyTotal ?? 0,
        topCategory: {
          category: dataStats?.topCategory?.category ?? "",
          monthly: dataStats?.topCategory?.monthly ?? 0,
        },
        upcomingRenewalsCount: dataStats?.upcomingRenewalsCount ?? 0,
        nearestRenewal: {
          id: dataStats?.nearestRenewal?.id ?? "",
          name: dataStats?.nearestRenewal?.name ?? "",
          days: dataStats?.nearestRenewal?.days ?? 0,
          amount: dataStats?.nearestRenewal?.amount ?? 0,
        }
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  fetchData();
}, [data]); 



  return (
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-7 mx-5 mb-6">
      {/* <Card
        title="Monthly Spending"
        icon={<IndianRupee/>}
        amount={loading || String(convert(dashboardData?.monthlyTotal ?? 0)) == "undefined" ? <Skeleton className="h-6 w-24" /> : String(dashboardData?.monthlyTotal)}
        muted={loading ? <Skeleton className="h-4 w-32" /> : "From last month"} 
        percentage={5.2}
        // muted = "from last month"
      /> */}
      <Card
        title="Monthly Spending"
        icon={currencyOptions.find(c => c.value === currency)?.symbol ? <span className="text-4xl">{currencyOptions.find(c => c.value === currency)?.symbol}</span> : <IndianRupee />}
        amount={
          loading || !dashboardData
            ? <Skeleton className="h-6 w-24" />
            : `${convert(dashboardData.monthlyTotal).toFixed(0)}`
        }
        muted="From last month"
        percentage={5.2}
      />
      <Card 
        title="Active Subscriptions"
        icon={<CreditCard />}
        amount={
          loading || !dashboardData
            ? <Skeleton className="h-6 w-24" />
            : String(dashboardData.activeSubscriptions)
        }
        muted="Average per subscription"
      />
      <Card 
        title="Top Category"
        icon={<TrendingUp />}
        amount={
          loading || !dashboardData
            ? <Skeleton className="h-6 w-24" />
            : dashboardData.topCategory.category
        }
        muted={
          loading || !dashboardData
            ? <Skeleton className="h-4 w-32" />
            : `${convert(dashboardData.topCategory.monthly).toFixed(2)}/month`
        }
      />
    <Card
      title="Next Renewal"
      icon={<CalendarClock />}
      amount={
        loading || !dashboardData
          ? <Skeleton className="h-6 w-24" />
          : `${dashboardData.nearestRenewal.days.toFixed(0)} days`
      }
      muted={
        loading || !dashboardData
          ? <Skeleton className="h-4 w-32" />
          : dashboardData.nearestRenewal.name
            ? `${dashboardData.nearestRenewal.name} - ${convert(
                dashboardData.nearestRenewal.amount
              ).toFixed(1)}/month`
            : "No renewal"
      }
    />
      </div>
    // <div className="w-[25%] h-fit bg-card text-card-foreground border rounded-2xl py-3 px-5 shadow-sm">
    //   <div className="flex flex-row justify-between items-center mb-4 ">
    //     <h1 className="text-muted-foreground">Monthly Spending</h1>
    //     <p className="text-foreground "><IndianRupee/></p>
    //   </div>
    //   <h1 className="text-foreground text-3xl font-semibold">$8438.8</h1>
    //   <div className="flex flex-row items-center gap-2 mt-2">
    //     <p className=" text-red-600 flex flex-row text-sm items-center"> 
    //       <ArrowUpRight/>+5.2%  
    //     </p>
    //     <p className="text-muted-foreground text-sm">from last month</p>
    //   </div>
    // </div>
  );
}

