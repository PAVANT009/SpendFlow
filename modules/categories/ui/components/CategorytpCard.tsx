import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'


export interface CardProps {
  title: string;
  icon?: React.ReactNode;
  amount: React.ReactNode;   
  muted?: React.ReactNode;    
  mutedicon?: React.ReactNode;
  percentage?: number;
  loading? : boolean;
}

export default function CategorytpCard(props : CardProps) {
  return (
    <div className="w-[250px]  h-28 bg-card text-card-foreground border border-border rounded-2xl py-3 px-5 shadow-sm">
      <div className='flex flex-row'>
        <div className="flex flex-row  items-center gap-3">
          <div className='flex justify-start flex-col'>
            <h1 className="text-foreground  text-sm">
              { props.loading ? <Skeleton className="h-4 w-16" /> :
                props.title
              }
              </h1>
          <div className="text-foreground text-2xl font-semibold mt-1">
            { props.loading ? (
              <span className="block">
                <Skeleton className="h-4 w-16 mt-1" />
              </span>
            ) : (
              props.amount
            )}
          </div>
          </div>
        </div>
        <div className='ml-auto text-muted-foreground text-3xl'>
          {props.loading ? <Skeleton className="h-9 w-11" /> :
            props.icon
          }
        </div>
      </div>
      {props.loading ? <Skeleton className="h-4 w-32 mt-1" /> :
      <div className='text-muted-foreground text-sm mt-1'>{props.title == "Total categories" ? `${props.amount}  with budget limits` : props.title == "Budget Utilization" ? "of budget" : "Across all categories" }</div>
    }
    </div>
  )
}