import { auth } from "@/app/lib/auth";
import { db } from "@/app/db";
import { subscription } from "@/app/db/schema";
import { NextResponse } from "next/server";


function toMonthly(amount: number, cycleType: string, cycleCount: number) {
  switch (cycleType) {
    case "week":
      return (amount / cycleCount) * 4.345;            // approx weeks per month
    case "month":
      return amount / cycleCount;                      // normal monthly cycle
    case "year":
      return amount / (cycleCount * 12);               // convert to monthly equivalent
    default:
      return 0;
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(session.user.id);

    const subs = await db.query.subscription.findMany({
      where: (fields, { eq }) => eq(fields.userId, userId),
    });

    const now = new Date();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const activeSubscriptions = subs.length;

    let monthlyTotal = 0;
    for (const s of subs) {
      const amountNum = Number(s.amount);
      if (s.cycleType === "month" && s.cycleCount === 1) {
        monthlyTotal += amountNum;
      }
    }

    const categoryTotals = new Map<string, number>();

    for (const s of subs) {
      const amountNum = Number(s.amount);
      const category = s.category;
      const monthlyEquivalent = toMonthly(amountNum, s.cycleType, s.cycleCount);

      const prev = categoryTotals.get(category) ?? 0;
      categoryTotals.set(category, prev + monthlyEquivalent);
    }

    let topCategory = { category: null as string | null, monthly: 0 };

    for (const [category, value] of categoryTotals.entries()) {
      if (value > topCategory.monthly) {
        topCategory = { category, monthly: Number(value.toFixed(2)) };
      }
    }

    let upcomingRenewalsCount = 0;

    for (const s of subs) {
      const nb = new Date(s.nextBilling);
      const diffDays = (nb.getTime() - now.getTime()) / MS_PER_DAY;

      if (diffDays >= 0 && diffDays <= 7) {
        upcomingRenewalsCount++;
      }
    }

    return NextResponse.json({
      activeSubscriptions,
      monthlyTotal: Number(monthlyTotal.toFixed(2)),
      topCategory,
      upcomingRenewalsCount,
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Failed to get stats", details: String(err) },
      { status: 500 }
    );
  }
}
