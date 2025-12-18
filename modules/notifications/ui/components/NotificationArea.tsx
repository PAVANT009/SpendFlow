import { Bell, Calendar } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function NotificationArea({value}: {value: string}) {
  const [data,setData] = useState<{ id: string; name: string; days: number,amount: number, nextRenewal: Date,category: string }[]>();
  useEffect(() => {
    const fetchData = async() => {
      const res = await fetch("/api/subscriptions/stats");
      const data = await res.json();
      setData(data.upcomingSub);
    }
    fetchData();
  },[])
  return (
    <div className='mt-3 bg-card/50 border border-border w-full h-fit rounded-xl'>
          {value == "upcoming" && (
            data?.length == 0 ? 
           (
          <div className='flex flex-col gap-1 py-7  justify-center items-center'>
            <Bell size={20} opacity={"0.3"}/>
            <p className='text-muted-foreground '>No upcoming notifications scheduled</p>
            <p className='text-muted-foreground text-sm'>Your notifications will appear here when they&apos;re ready</p>
        </div>
          ) : (
            <div className='px-7 py-3'>
                <div className='flex flex-row  gap-2.5 font-bold'>
                  <Calendar color='#16a34a'/> 
                  <p className='text-center'>Upcoming Payments</p>      
                </div>
                  <p className='text-muted-foreground px-5 py-3  text-sm'>{data?.length} subscriptions</p>  
                  <div className='w-full'>
              {data?.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-row justify-between items-center px-4 py-2  "
                >
                  <div className="flex flex-col">
                    <p className="text-foreground font-semibold">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">{sub.category}</p>
                  </div>

                  <div className="flex flex-col text-sm text-muted-foreground text-right">
                    <p>In {sub.days.toFixed()} days</p>
                    <p>Renews on {new Date(sub.nextRenewal).toLocaleDateString()}</p>
                  </div>

                  <p className="text-sm text-foreground font-semibold">
                    ${sub.amount}
                  </p>
                </div>
              ))}

              </div>
              </div>
          ))}
          {value == "all" && (
            <div>
              <div className='px-7 py-3'>
                <div className='flex flex-row  gap-2.5 font-bold'>
                  <Calendar color='#16a34a'/> 
                  <p className='text-center'>Upcoming Payments</p>      
                </div>
                  <p className='text-muted-foreground px-5 py-3  text-sm'>{data?.length} subscriptions</p>  
                  <div className='w-full'>
              {data?.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-row justify-between items-center px-4 py-2  "
                >
                  <div className="flex flex-col">
                    <p className="text-foreground font-semibold">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">{sub.category}</p>
                  </div>

                  <div className="flex flex-col text-sm text-muted-foreground text-right">
                    <p>In {sub.days.toFixed()} days</p>
                    <p>Renews on {new Date(sub.nextRenewal).toLocaleDateString()}</p>
                  </div>

                  <p className="text-sm text-foreground font-semibold">
                    ${sub.amount}
                  </p>
                </div>
              ))}

              </div>
              </div>
            </div>
          )}
          {value == "recent" && (
            <div className='flex flex-col gap-1 py-7  justify-center items-center'>
              <Bell size={20} opacity={"0.3"}/>
              <p className='text-muted-foreground '>No upcoming notifications scheduled</p>
              <p className='text-muted-foreground text-sm'>Your notifications will appear here when they&apos;re ready</p>
            </div>
          )}
    </div>
  )
}
