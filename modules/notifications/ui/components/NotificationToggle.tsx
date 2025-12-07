"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export type RangeOption = "upcoming" | "recent" | "all";

export interface YearMonthToggleProps {
  value: RangeOption;
  onChange: (v: RangeOption) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function NotificationToggle({
  value,
  onChange,
  label,
  size = "md",
}: YearMonthToggleProps) {
  const options = [
    { key: "upcoming", label: "Upcoming"},
    { key: "recent", label: "Recent"},
    { key: "all", label: "All"}
  ] as const;

  return (
    <div className="inline-flex mt-7 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}

      <div role="tablist" className="inline-flex bg-muted/40 rounded-xl p-0.5 items-center">
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
              className={`flex items-center gap-2 mx-1 rounded-xl transition-all ${
                selected ? "shadow-sm" : "opacity-70 hover:opacity-100"
              }`}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
