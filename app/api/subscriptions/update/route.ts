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
