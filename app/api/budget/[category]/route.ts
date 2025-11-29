import { NextRequest, NextResponse } from "next/server"
import { db } from "@/app/db"
import { budget } from "@/app/db/schema"
import { auth } from "@/app/lib/auth"
import { and, eq } from "drizzle-orm"

export async function GET(req: NextRequest, { params }: { params: { category: string } }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { category } = params

    const budgets = await db
      .select()
      .from(budget)
      .where(
         and(
            eq(budget.userId, session.user.id),
            eq(budget.category, category)
    )
      )

    return NextResponse.json(budgets)
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 })
  }
}
