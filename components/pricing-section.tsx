"use client"
import { PricingCard } from '@/modules/upgrade/ui/components/pricing-card'
import { redirect } from "next/navigation"




export default function PricingSection() {

  const productsM = [
    "Unlimited Expense Tracking",
    "AI Auto-Categorization",
    "Real-time Spending Insights",
    "Smart Budget Recommendations",
    "Instant Notifications",
    "Email Reports",
    "Unlimited Messages",
    "Unlimited Conversations"
  ]

  const productsY = [
    "2 Months Free",
    "Unlimited Expense Tracking",
    "AI Auto-Categorization",
    "Real-time Spending Insights",
    "Smart Budget Recommendations",
    "Advanced Analytics Dashboard",
    "Instant Notifications",
    "Detailed Email Reports",
    "Unlimited Messages",
    "Unlimited Conversations"
  ]

  // bg-[radial-gradient(circle_at_top,var(--primary)_0%,var(--background)_50%)]
  return (
    <div id="pricing" className="scroll-mt-28 flex flex-row justify-center items-start gap-5 py-10">
      <PricingCard
        key={"1"}
        buttonText={"Upgrade"}
        onClick={() => redirect("/sign-in")}
        variant={
          null
        }
        title={"Monthly"}
        price={9}
        description={"for teams getting started"}
        priceSuffix={"/month"}
        features={productsM}
        badge={null}
        landing={true}
        className='w-1/4'
      />
      <PricingCard
        key={"2"}
        buttonText={"Upgrade"}
        onClick={() => redirect("/sign-in")}
        variant={
          null
        }
        title={"Yearly"}
        price={19}
        description={"For teams that need to scale"}
        priceSuffix={"/year"}
        features={productsY}
        badge={null}
        landing={true}
        className='w-1/4'
      />
    </div>
  )
}

