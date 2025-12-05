import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/db";

interface HighCat {
  category: string;
  amount: number;
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const subs = await db.query.subscription.findMany({
      where: (fields, {eq}) => eq(fields.userId,userId)
    })

    let highesht = 0;
    let highCat:HighCat | null = null; ;

    for (const s of subs) {
      if(Number(s.amount) > highesht  ) {
        highesht = Number(s.amount);
        highCat = {category: s.category, amount: highesht}
      }
    }

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

    return NextResponse.json({ data: results.rows, highCat });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load analytics", }, { status: 500 });
  }
}
