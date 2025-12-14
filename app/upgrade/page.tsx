"use client"
import { UpgradeView } from '@/modules/upgrade/ui/components/upgrade-view'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
    {/* <Link href="/api/auth/polar/checkout">
        Upgrade to Pro
    </Link> */}
    <UpgradeView/>
    </div>
  )
}
