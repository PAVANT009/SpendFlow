import { auth } from "@/app/lib/auth";
import { db } from "@/app/db";
import { subscription } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(session.user.id);

    const body = await req.json();

    await db.insert(subscription).values({
      id: crypto.randomUUID(),
      userId,
      name: body.name,
      category: body.category,
      description: body.description || null,
      url: body.url || null,
      amount: String(body.amount),
      currency: body.currency,
      cycleType: body.cycleType,
      cycleCount: Number(body.cycleCount),
      startBilling: new Date(body.startBilling),
      nextBilling: new Date(body.nextBilling),
      reminder: Boolean(body.reminder),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create subscription", details: err.message },
      { status: 500 }
    );
  }
}
