import { Progress } from '@/components/ui/progress'
import React from 'react'


export interface CardProps {
  title: string;
  icon?: React.ReactNode;
  amount: React.ReactNode;   
  muted?: React.ReactNode;    
  mutedicon?: React.ReactNode;
  percentage?: number;
}

export default function CategorytpCard(props : CardProps) {
  return (
    <div className="w-[30%]  h-24 bg-card text-card-foreground border border-border rounded-2xl py-3 px-5 shadow-sm">
      <div className='flex flex-row'>
        <div className="flex flex-row  items-center gap-3">
          <div className='flex justify-start flex-col'>
            <h1 className="text-foreground  text-sm">{props.title}</h1>
            <p className="text-foreground text-2xl font-semibold mt-1">{props.amount}</p>
          </div>
        </div>
        <div className='ml-auto text-muted-foreground '>
          {props.icon}
        </div>
      </div>
      <div className='text-muted-foreground text-sm mt-1'>{props.title == "Total categories" ? `${props.amount}  with budget limits` : props.title == "Budget Utilization" ? "of budget" : "Across all categories" }</div>
    </div>
  )
}