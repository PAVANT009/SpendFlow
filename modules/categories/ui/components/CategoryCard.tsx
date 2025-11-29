"use client";
import { Progress } from '@/components/ui/progress'
import { Budget } from '@/types/Budget'
import React, { useEffect, useState } from 'react'

interface Categorystat {
  category: string,
  subscriptionCount: number,
  totalMonthly: number,
}


export default function CategoryCard({categoryData} : {categoryData:Budget}) {
  const [data,setData] = useState<Categorystat>();
  useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(`/api/subscriptions/stats/${categoryData.category}`);
    const data = await res.json();
    setData(data);
  }

  fetchData();
},[])
  return (
    <div className="w-full h-40 bg-card text-card-foreground border border-border rounded-2xl py-3 px-5 shadow-sm">
      <div className="flex flex-row  items-center mb-4 gap-3">
        <div className='bg-purple-500 w-10 h-10 rounded-xl'></div>
        <div className='flex justify-start flex-col'>
          <h1 className="text-muted-foreground">{categoryData.category}</h1>
          <p className="text-foreground ">{data?.subscriptionCount} Subscriptions</p>
        </div>
      </div>
      <div className='flex flex-row justify-between'>
        <p className='text-muted-foreground font-light'>Spent this moth </p>
        <h1 className="text-foreground text-sm font-medium">${data?.totalMonthly}</h1>
      </div>
      <div className='flex flex-row justify-between'>
        <p className='text-muted-foreground font-light'>Monthly Budget</p>
        <h1 className="text-foreground text-sm font-medium">${categoryData.maxBudget}</h1>
      </div>
      <Progress value={data && categoryData
      ? (data.subscriptionCount / categoryData.maxBudget) * 100
      : 0} className=' mt-1 bg-muted-foreground'/>
    </div>
  )
}