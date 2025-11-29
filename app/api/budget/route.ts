import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { budget } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgets = await db
      .select()
      .from(budget)
      .where(eq(budget.userId, session.user.id));

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET /budget error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, maxBudget } = await request.json();

    if (!category || !maxBudget) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await db
      .select()
      .from(budget)
      .where(and(eq(budget.userId, session.user.id), eq(budget.category, category)));

    if (exists.length > 0) {
      await db
        .update(budget)
        .set({ maxBudget, updatedAt: new Date() })
        .where(and(eq(budget.userId, session.user.id), eq(budget.category, category)));

      return NextResponse.json({ message: "Budget updated" });
    }

    await db.insert(budget).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      category,
      maxBudget,
    });

    return NextResponse.json({ message: "Budget created" });
  } catch (error) {
    console.error("POST /budget error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
