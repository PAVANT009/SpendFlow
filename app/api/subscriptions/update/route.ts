import { db } from "@/app/db";
import { subscription } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.update(subscription)
      .set({
        state: Boolean(body.state),
      })
      .where(eq(subscription.id, body.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to update,error: ${error}` }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, startBilling, nextBilling, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  // const updates = {
  //   ...rest,
  //   ...(startBilling && { startBilling: new Date(startBilling) }),
  //   ...(nextBilling && { nextBilling: new Date(nextBilling) }),
  //   updatedAt: new Date(),
  // };
  try {
    await db
    .update(subscription)
    .set({
      name: body.name,
    category: body.category,
    description: body.description,
    url: body.url,
    logoUrl: body.logoUrl,

    amount: body.amount,
    currency: body.currency,

    cycleType: body.cycleType,
    cycleCount: body.cycleCount,
    
    startBilling: new Date(body.startBilling),
    nextBilling: new Date(body.nextBilling),

    reminder: body.reminder,
    state: body.state,

    updatedAt: new Date(),
    })
    .where(eq(subscription.id, id));
  } catch (error) {
    return NextResponse.json({ error: `Failed to update,error: ${error}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}