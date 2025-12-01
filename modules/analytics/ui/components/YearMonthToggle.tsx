"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export type RangeOption = "month" | "year";

export interface YearMonthToggleProps {
  value: RangeOption;
  onChange: (v: RangeOption) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function YearMonthToggle({
  value,
  onChange,
  label,
  size = "md",
}: YearMonthToggleProps) {
  const options = [
    { key: "month", label: "Month", icon: <Calendar className="h-4 w-4" /> },
    { key: "year", label: "Year", icon: <Clock className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="inline-flex flex-col gap-1 items-start">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}

      <div role="tablist" className="inline-flex bg-muted/40 rounded-xl p-1 items-center">
        {options.map((opt) => {
          const selected = value === opt.key;
          return (
            <Button
              key={opt.key}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(opt.key)}
              size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
              variant={selected ? "default" : "ghost"}
              className={`flex items-center gap-2 rounded-lg transition-all ${
                selected ? "shadow-sm" : "opacity-70 hover:opacity-100"
              }`}
            >
              {opt.icon}
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
