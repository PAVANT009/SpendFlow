import { NextRequest, NextResponse } from "next/server";
import { eq, count } from "drizzle-orm";

import { db } from "@/app/db";
import { conversations, messages } from "@/app/db/schema";
import { polarClient } from "@/app/lib/polar";
import { auth } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const customer = await polarClient.customers.getStateExternal({
    externalId: userId,
  });

  const activeSubscription = customer.activeSubscriptions?.[0];

  if (activeSubscription) {
    return NextResponse.json(null);
  }

  const [conversationCount] = await db
    .select({ count: count(conversations.id) })
    .from(conversations)
    .where(eq(conversations.userId, userId));

  const [messageCount] = await db
    .select({ count: count(messages.id) })
    .from(messages)
    .where(eq(messages.userId, userId));

  return NextResponse.json({
    conversationCount: conversationCount.count,
    messageCount: messageCount.count,
  });
}
