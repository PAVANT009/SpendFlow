"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, CalendarClock, CreditCard, IndianRupee, TrendingUp, User } from "lucide-react";
import Card from "./card";
import { Subscription } from "@/types/Subscription";

export default function UsersStats({data,loading} :{data:Subscription[] ,loading: boolean}) {

  const [dashboardData, setDashboardData] = useState<null | {
  activeSubscriptions: number;
  monthlyTotal: number ;
  topCategory: { category: string; monthly: number };
  upcomingRenewalsCount: number;
  nearestRenewal: { id: string; name: string; days: number,amount: number  }
}>(null);

useEffect(() => {
  const fetchData = async () => {
    const res = await fetch("/api/subscriptions/stats");
    const dataStats = await res.json();
    setDashboardData(dataStats);
  };
  
  fetchData();
}, [data]);



  return (
    <div className="flex flex-row gap-7 mx-5 mb-6">
      <Card
        title="Monthly Spending"
        icon={<IndianRupee/>}
        amount={loading || String(dashboardData?.monthlyTotal) == "undefined" ? <Skeleton className="h-6 w-24" /> : String(dashboardData?.monthlyTotal)}
        muted={loading ? <Skeleton className="h-4 w-32" /> : "From last month"} 
        percentage={5.2}
        // muted = "from last month"
      />
      <Card 
        title="Active Subscriptions"
        icon={<CreditCard/>}
        amount={ loading ||  String(dashboardData?.activeSubscriptions) == "undefined" ? <Skeleton className="h-6 w-24" />:String(dashboardData?.activeSubscriptions) }
        muted="Average $10.65 each"
      />
      <Card 
        title="Top Category"
        icon={<TrendingUp/>}
        amount={ loading ||  String(dashboardData?.topCategory["category"]) == "undefined" ? <Skeleton className="h-6 w-24" />:String(dashboardData?.topCategory["category"])}
        muted={dashboardData?.topCategory.monthly ? `$${dashboardData?.topCategory.monthly}/month` : <Skeleton className="h-4 w-32" />}
      />
      <Card
        title="Next Renewal"
        icon={<CalendarClock/>}
        amount={ loading ||  String(dashboardData?.upcomingRenewalsCount) == "undefined" ? <Skeleton className="h-6 w-24" />: String(dashboardData?.nearestRenewal.days.toFixed(0)) + " days"}
        muted={dashboardData?.nearestRenewal !== null ?  dashboardData?.nearestRenewal.name ?  ` ${dashboardData?.nearestRenewal.name}- $${dashboardData?.nearestRenewal.amount}/month` : <Skeleton className="h-4 w-32" /> : "No renewal"}
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

