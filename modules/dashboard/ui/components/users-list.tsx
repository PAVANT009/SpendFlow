"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";
import { ArrowUpRight, CalendarClock, CreditCard, IndianRupee, TrendingUp } from "lucide-react";
import Card from "./card";

export default function UsersList({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);

  const loading = users.length === 0; // ✅ computed (no useEffect needed)

  return (
    <div className="flex flex-row gap-7 mx-7">
      <Card
        title="Monthly Spending"
        icon={<IndianRupee/>}
        amount="$8438.8"
        mutedicon={<ArrowUpRight/>}
        percentage={5.2}
        muted = "from last month"
      />
      <Card 
        title="Active Subscriptions"
        icon={<CreditCard/>}
        amount="19"
        muted="Average $10.65 each"
      />
      <Card 
        title="Top Category"
        icon={<TrendingUp/>}
        amount="Entertainment"
        muted="$56.00/month"
      />
      <Card
        title="Next Renewal"
        icon={<CalendarClock/>}
        amount="in 4 days"
        muted="Duolingo Plus - $6.99"
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


function UsersSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
            <Skeleton className="h-3 w-1/3 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
