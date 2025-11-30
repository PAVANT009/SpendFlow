"use client";

import CategoryCard from '@/modules/categories/ui/components/CategoryCard'
import CategorytCard from '@/modules/categories/ui/components/CategorytpCard'
import { Budget } from '@/types/Budget';
import { useEffect, useState } from 'react'
import {Folder,TrendingUp,DollarSign} from 'lucide-react';
const colorMap: Record<number, string> = {
  0: "bg-purple-500",
  1: "bg-green-500",
  2: "bg-blue-500",
  3: "bg-yellow-500",
  4: "bg-orange-500",
  5: "bg-pink-500",
};
export default function Page() {
  const [categoryData,setCategoryData] = useState<Budget[]>();
  const [cardtpData, setCardtpData] = useState<null | {
    activeSubscriptions: number;
    monthlyTotal: number ;
    topCategory: { category: string; monthly: number };
    upcomingRenewalsCount: number;
  }>(null);
const [totalUsedBudget, setTotalUsedBudget] = useState(0);
  useEffect( () => {
    const fetchData = async() => {
      const res1 = await fetch("api/budget");
      const data = await res1.json();
      setCategoryData(data);
      const res2 = await fetch("/api/subscriptions/stats");
      const dataStats = await res2.json();
      setCardtpData(dataStats);
    }
    fetchData();
  },[])

  const totalMaxBudget = categoryData?.reduce((sum, item) => sum + Number(item.maxBudget), 0) ?? 0;


  return (
    <div className='bg-background h-screen w-full px-12 py-1'>
      <p className='text-3xl ml-1 mb-1 font-semibold'>Categories</p>
      <h1 className='text-sm ml-1 mb-6 font-light text-muted-foreground'>Organize your subscriptions and set budget limits for each category</h1>
      <div className='flex flex-row gap-14 mb-9 '>
        <CategorytCard icon={<Folder size={20}/>} title='Total categories' amount={cardtpData?.activeSubscriptions}/>
        <CategorytCard icon={<DollarSign size={20}/>} title='Total Monthly Budget' amount={cardtpData?.monthlyTotal}/>
        <CategorytCard icon={<TrendingUp size={20}/>} title='Budget Utilization' amount={`${((totalUsedBudget / totalMaxBudget) * 100).toFixed(0)}%`}/>
      </div>
      {/* <div className='h-[22%] w-full'></div> */}
      <div className="grid grid-cols-3 gap-8">
        {categoryData?.map((item,index) =>{ 
          return (
            <CategoryCard
            onTotalMonthly={(value) => setTotalUsedBudget(prev => prev + value)}
            key={item.id}
            color={colorMap[index ]}
            categoryData={item}
            />
          )
        })}
      </div>

      {/* <div className='flex flex-row gap-8'>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
      </div> */}
    </div>
  )
}
