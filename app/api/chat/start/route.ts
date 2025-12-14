import { db } from "@/app/db";
import { conversations } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const title = "New Conversation";
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || !session.user) {
    console.error("[Auth] Unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = String(session.user.id);

  const [conv] = await db
    .insert(conversations)
    .values({ 
      userId: userId,
      title
    })
    .returning();

  return NextResponse.json({ id: conv.id });
}
