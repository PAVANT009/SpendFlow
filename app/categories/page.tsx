"use client";

import CategoryCard from '@/modules/categories/ui/components/CategoryCard'
import CategorytCard from '@/modules/categories/ui/components/CategorytpCard'
import { Budget } from '@/types/Budget';
import { useEffect, useState } from 'react'

export default function Page() {
  const [categoryData,setCategoryData] = useState<Budget[]>();
  useEffect( () => {
    const fetchData = async() => {
      const res = await fetch("api/budget");
      const data = await res.json();
      setCategoryData(data);
      console.log(data)
    }
    fetchData();
  },[])

  return (
    <div className='bg-background h-screen w-full px-12 py-1'>
      <p className='text-3xl ml-1 mb-1 font-semibold'>Categories</p>
      <h1 className='text-sm ml-1 mb-6 font-light text-muted-foreground'>Organize your subscriptions and set budget limits for each category</h1>
      <div className='flex flex-row gap-8 mb-9'>
        <CategorytCard/>
        <CategorytCard/>
        <CategorytCard/>
      </div>
      {/* <div className='h-[22%] w-full'></div> */}
      <div className="grid grid-cols-3 gap-8">
        {categoryData?.map((item) => (
          <CategoryCard
            key={item.id}
            categoryData={item}
          />
        ))}
      </div>

      {/* <div className='flex flex-row gap-8'>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
      </div> */}
    </div>
  )
}
