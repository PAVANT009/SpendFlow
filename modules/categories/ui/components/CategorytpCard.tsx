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


export default function CategorytpCard() {
  return (
    <div className="w-[30%] h-24 bg-card text-card-foreground border border-border rounded-2xl py-5 px-5 shadow-sm">
      <div className="flex flex-row  items-center gap-3">
        <div className='flex justify-start flex-col'>
          <h1 className="text-muted-foreground">Entertainment</h1>
          <p className="text-foreground ">3 Subscriptions</p>
        </div>
      </div>
    </div>
  )
}