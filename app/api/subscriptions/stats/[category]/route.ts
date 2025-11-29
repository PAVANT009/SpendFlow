import { auth } from "@/app/lib/auth";
import { db } from "@/app/db";
import { subscription } from "@/app/db/schema";
import { NextResponse } from "next/server";

function toMonthly(amount: number, cycleType: string, cycleCount: number) {
  switch (cycleType) {
    case "week":
      return (amount / cycleCount) * 4.345;
    case "month":
      return amount / cycleCount;
    case "year":
      return amount / (cycleCount * 12);
    default:
      return 0;
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ category: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(session.user.id);
    const { category } = await context.params;

    const subs = await db.query.subscription.findMany({
      where: (fields, { eq, and }) =>
        and(eq(fields.userId, userId), eq(fields.category, category)),
    });

    const subscriptionCount = subs.length;

    let totalMonthly = 0;
    for (const s of subs) {
      totalMonthly += toMonthly(Number(s.amount), s.cycleType, s.cycleCount);
    }

    return NextResponse.json({
      category,
      subscriptionCount,
      totalMonthly: Number(totalMonthly.toFixed(2)),
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Failed to get category stats", details: String(err) },
      { status: 500 }
    );
  }
}
