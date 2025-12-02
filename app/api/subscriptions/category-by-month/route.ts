import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/db";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const results = await db.execute(sql`
      SELECT 
        category,
        EXTRACT(YEAR FROM start_billing)::int AS year,
        EXTRACT(MONTH FROM start_billing)::int AS month,
        COUNT(*)::int AS count
      FROM subscription
      WHERE user_id = ${userId}
      GROUP BY category, year, month
      ORDER BY year, month;
    `);

    return NextResponse.json(results.rows);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
