"use client";

import NotificationArea from '@/modules/notifications/ui/components/NotificationArea';
import NotificationToggle from '@/modules/notifications/ui/components/NotificationToggle'
import React, { useState } from 'react'

export default function Page() {
    const [state,setState] = useState<"upcoming" | "all" | "recent">("upcoming");
  return (
      <div className='bg-background h-screen w-full px-12 py-3'>
      <p className='text-3xl text-foreground font-semibold'>Notifications</p>
      <p className='text-sm text-muted-foreground mt-1.5'>View and manage your subscription alerts</p>
      <NotificationToggle value={state} onChange={setState}/>
      <NotificationArea value= {state}/>
    </div>
  )
}
