import React from 'react'

export interface CardProps {
  title: string;
  icon: React.ReactNode;
  amount: React.ReactNode;   
  muted: React.ReactNode;    
  mutedicon?: React.ReactNode;
  percentage?: number;
}

export default function Card(props : CardProps) {
  return (
    <div className="w-[25%] h-fit bg-card text-card-foreground border rounded-2xl py-5 px-5 shadow-sm">
      <div className="flex flex-row justify-between items-center mb-4 ">
        <h1 className="text-muted-foreground">{props.title}</h1>
        <p className="text-foreground ">{props.icon}</p>
      </div>
      <h1 className="text-foreground text-2xl font-semibold">{props.amount}</h1>
      <div className="flex flex-row items-center gap-2 mt-2">
        {props.mutedicon? 
            (
              <p className=" text-red-600 flex flex-row text-sm items-center">
                {props.mutedicon}{props.percentage}%
              </p>  )  : null}
        <p className="text-muted-foreground text-sm">from last month</p>
      </div>
    </div>
  )
}
