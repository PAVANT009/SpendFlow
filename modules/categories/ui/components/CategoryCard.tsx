"use client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Budget } from "@/types/Budget";
import React, { useEffect, useRef, useState } from "react";
import { CategoryActions } from "./CategoryActions";

interface Categorystat {
  category: string;
  subscriptionCount: number;
  totalMonthly: number;
}

export default function CategoryCard({
  categoryData,
  color,
  onTotalMonthly,
}: {
  categoryData: Budget;
  color: string;
  onTotalMonthly: (value: number) => void;
}) {
  const sentRef = useRef(false);
  const [data, setData] = useState<Categorystat | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/subscriptions/stats/${categoryData.category}`);
      const data = await res.json();
      setData(data);
      if (!sentRef.current) {
        onTotalMonthly(data.totalMonthly);
        sentRef.current = true;
      }
    };
    fetchData();
  }, []);

  const loading = !data; 

  return (
    <div className="w-full h-44 bg-card text-card-foreground border border-border rounded-2xl py-3 px-5 shadow-sm">
      <div className="flex flex-row items-center mb-4 gap-3">
        
        {/* ICON box skeleton */}
        {loading ? (
          <Skeleton className="w-12 h-12 rounded-xl" />
        ) : (
          <div className={`w-12 h-12 rounded-xl ${color}`} />
        )}

        <div className="flex justify-start flex-col">
          <h1 className="text-foreground">
            {loading ? <Skeleton className="h-4 w-28" /> : categoryData.category}
          </h1>

          <p className="text-muted-foreground">
            {loading ? <Skeleton className="h-4 w-20 mt-2" /> : `${data?.subscriptionCount} Subscriptions`}
          </p>
        </div>

        <div className="ml-auto">
          {loading ? <Skeleton className="w-6 h-6 rounded-md" /> : <CategoryActions categoryData={categoryData} />}
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <p className="text-muted-foreground font-light">Spent this month</p>
        <h1 className="text-foreground text-sm font-medium">
          {loading ? <Skeleton className="h-4 w-12" /> : `$${data?.totalMonthly}`}
        </h1>
      </div>

      <div className="flex flex-row justify-between mt-1">
        <p className="text-muted-foreground font-light">Monthly Budget</p>
        <h1 className="text-foreground text-sm font-medium">
          {loading ? <Skeleton className="h-4 w-12" /> : `$${categoryData.maxBudget}`}
        </h1>
      </div>

      {loading ? (
        <Skeleton className="h-2 w-full mt-3.5 rounded-full" />
      ) : (
        <Progress
          value={(data.totalMonthly / Number(categoryData.maxBudget)) * 100}
          className="mt-3.5"
        />
      )}
    </div>
  );
}

// "use client";
// import { Progress } from '@/components/ui/progress'
// import { Budget } from '@/types/Budget'
// import React, { useEffect, useRef, useState } from 'react'
// import { CategoryActions } from './CategoryActions';

// interface Categorystat {
//   category: string,
//   subscriptionCount: number,
//   totalMonthly: number,
// }


// export default function CategoryCard({categoryData,color,onTotalMonthly} : {categoryData:Budget, color:string, onTotalMonthly: (value: number) => void}) {
//   const sentRef = useRef(false);
//   const [data,setData] = useState<Categorystat>();
//   useEffect(() => {
//   const fetchData = async () => {
//     const res = await fetch(`/api/subscriptions/stats/${categoryData.category}`);
//     const data = await res.json();
//     setData(data);
//     if (!sentRef.current) {
//       onTotalMonthly(data.totalMonthly);
//       sentRef.current = true;
//     }
//     }
//   fetchData();
//   },[])
//   return (
//     <div className="w-full h-44 bg-card text-card-foreground border border-border rounded-2xl py-3 px-5 shadow-sm">
//       <div className="flex flex-row  items-center mb-4 gap-3">
//         <div className={`w-12 h-12 rounded-xl ${color ? color : null}`}></div>
//         <div className='flex justify-start flex-col'>
//           <h1 className="text-foreground">
//             {categoryData.category}
//             </h1>
//           <p className="text-muted-foreground ">{data?.subscriptionCount} Subscriptions</p>
//         </div>
//         <div className='ml-auto'>
//           <CategoryActions categoryData={categoryData}/>
//         </div>
//       </div>
//       <div className='flex flex-row justify-between'>
//         <p className='text-muted-foreground font-light'>Spent this moth </p>
//         <h1 className="text-foreground text-sm font-medium">${data?.totalMonthly}</h1>
//       </div>
//       <div className='flex flex-row justify-between'>
//         <p className='text-muted-foreground font-light'>Monthly Budget</p>
//         <h1 className="text-foreground text-sm font-medium">${categoryData.maxBudget}</h1>
//       </div>
//       <Progress value={data && categoryData
//       ? (data.subscriptionCount / categoryData.maxBudget) * 100
//       : 0} className=' mt-3.5 bg-muted-foreground'/>
//     </div>
//   )
// }