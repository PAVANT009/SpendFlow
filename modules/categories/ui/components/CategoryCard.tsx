import { Progress } from '@/components/ui/progress'
import React from 'react'

// export interface CardProps {
//   title: string;
//   icon: React.ReactNode;
//   amount: React.ReactNode;   
//   muted: React.ReactNode;    
//   mutedicon?: React.ReactNode;
//   percentage?: number;
// }


export default function CategoryCard() {
  return (
    <div className="w-[30%] h-40 bg-card text-card-foreground border border-border rounded-2xl py-3 px-5 shadow-sm">
      <div className="flex flex-row  items-center mb-4 gap-3">
        <div className='bg-purple-500 w-10 h-10 rounded-xl'></div>
        <div className='flex justify-start flex-col'>
          <h1 className="text-muted-foreground">Entertainment</h1>
          <p className="text-foreground ">3 Subscriptions</p>
        </div>
      </div>
      <div className='flex flex-row justify-between'>
        <p className='text-muted-foreground font-light'>Spent this moth </p>
        <h1 className="text-foreground text-sm font-medium">$4343</h1>
      </div>
      <div className='flex flex-row justify-between'>
        <p className='text-muted-foreground font-light'>Monthly Budget</p>
        <h1 className="text-foreground text-sm font-medium">$843939</h1>
      </div>
      <Progress value={50} className=' mt-1 bg-muted-foreground'/>
    </div>
  )
}