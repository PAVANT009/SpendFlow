import { CircleCheckIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Solution() {
  const solutions = [
    {
      title: "Intelligent Expense Analysis",
      desc: "Automatically categorizes your purchases the moment you send them - no spreadsheets, no manual entry.",
    },
    {
      title: "Smart Budget Optimization",
      desc: "Analyzes your spending patterns and suggests realistic budgets tailored to your lifestyle.",
    },
    {
      title: "Real-Time Alerts",
      desc: "Get instant notifications when you overspend, hit limits, or approach your budget thresholds.",
    },
    {
      title: "AI-Powered Insights",
      desc: "Understand where your money actually goes with clear breakdowns and actionable suggestions.",
    },
    {
      title: "Adaptive Financial Learning",
      desc: "The system learns from your habits over time, improving recommendations and accuracy automatically.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-row justify-between items-center mx-10 my-14">
      <div className="w-1/2">
        <div className="mb-5">
          <div className="text-3xl font-medium flex flex-col gap-2.5">
            Engineered for
            <span className="text-primary mb-4">Smarter Spending Control</span>
          </div>
          <span className="font-medium">
            Our AI engine is trained on real-world financial behavior to
            understand how people spend, save, and budget - helping you stay in
            control without manual tracking.
          </span>
        </div>

        <div>
          <ul>
            {solutions.map((sol, i) => (
              <li key={i} className="flex flex-col gap-4.5 mt-4">
                <div className="flex flex-row gap-2">
                  <CircleCheckIcon className="text-primary" />
                  {sol.title}
                </div>
                <div className="text-slate-400 ml-7">{sol.desc}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-[260px] w-1/3 px-6 flex flex-col justify-between items-center border bg-card rounded-xl shadow-[0_24px_60px_-16px] shadow-primary/35 py-6">
        <div className="w-full pb-3 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>

          <div className="text-xs text-muted-foreground tracking-wide">
            analysis_mode: active
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-lg font-semibold">
            🔓 You just unlocked ₹3,600 in savings
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Image
              src="https://img.logo.dev/netflix.com?token=pk_bwnOPNY5QAOypvol-QLeqQ"
              alt="Product"
              width={35}
              height={35}
              className="rounded-md"
            />
            <div className="text-sm text-muted-foreground">Netflix Annual Plan</div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1 ml-7">
            <p className="line-through">{"\u20B9"}999 / month</p>
            <p className="text-foreground font-medium">
              {"\u20B9"}699 / month (billed yearly)
            </p>
            <p className="text-green-500 font-medium">30% reduction</p>
          </div>

        </div>
      </div>
    </div>
  );
}
