import { auth } from "@/app/lib/auth";
import { db } from "@/app/db";
import { subscription } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";

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
      state: Boolean(body.state),
      createdAt: new Date(),
      updatedAt: new Date(),
      logoUrl: body.logo_url 
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
  if (err instanceof Error) {
    return NextResponse.json(
      { error: "Failed to create subscription", details: err.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Failed to create subscription", details: String(err) },
    { status: 500 }
  );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({headers: req.headers});

    if(!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const data = await db.query.subscription.findMany( {where: eq(subscription.userId, userId)})

    return NextResponse.json(data);
  } catch (err: unknown) {
    if(err instanceof Error) {
      return NextResponse.json(
        {error: "Failed to get subscriptions", details: err.message },
        {status: 500}
      )
    }
    return NextResponse.json(
        {error: "Failed to get subscriptions", details: String(err) },
        {status: 500}
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json().catch(() => null);
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.length > 0)
      : typeof body?.id === "string" && body.id.length > 0
        ? [body.id]
        : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: "Missing subscription id" }, { status: 400 });
    }

    await db
      .delete(subscription)
      .where(and(eq(subscription.userId, userId), inArray(subscription.id, ids)));

    return NextResponse.json({ success: true, deletedIds: ids });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete,error: ${error}` }, { status: 500 });
  }
}
