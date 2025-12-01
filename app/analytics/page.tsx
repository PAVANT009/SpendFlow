"use client";

import { ChartAreaDefault } from "@/modules/analytics/ui/components/AreaChart";
import { ChartBarLabel } from "@/modules/analytics/ui/components/BarChart";
import { ChartPieDonut } from "@/modules/analytics/ui/components/PieChart";
import YearMonthToggle, { RangeOption } from "@/modules/analytics/ui/components/YearMonthToggle";
import React, { useState } from "react";

export default function Page() {
  const [selected, setSelected] = useState<RangeOption>("month");

  return (
    <div>
      <YearMonthToggle value={selected} onChange={setSelected} />
      <div >
        <ChartAreaDefault/>
      </div>
      <div className="flex flex-row mt-4 gap-10 px-5">
        <ChartPieDonut/>
        <ChartBarLabel/>
      </div>
    </div>
  );
}
