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
    <div id="solution" className="scroll-mt-28 min-h-screen flex flex-row justify-between items-center mx-10 my-14">
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
        <div className="w-full rounded-2xl  bg-gradient-to-br from-card via-card to-primary/10 p-4 shadow-xl shadow-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-primary/25 blur-md" />
                <Image
                  src="https://img.logo.dev/netflix.com?token=pk_bwnOPNY5QAOypvol-QLeqQ"
                  alt="Netflix"
                  width={52}
                  height={52}
                  className="relative rounded-xl border border-white/15"
                />
              </div>

              <div>
                <p className="text-2xl font-semibold leading-none text-foreground">
                  Netflix
                </p>
                <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Subscription
                </p>
              </div>
            </div>

            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              Save 30%
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-border/70 bg-background/55 p-3 backdrop-blur-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Current plan</p>
                <p className="text-xl font-semibold text-foreground">
                  &#8377;699
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    / month
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">Was</p>
                <p className="text-sm font-medium text-muted-foreground line-through">
                  &#8377;999 / month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


