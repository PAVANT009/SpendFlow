// Creates a new conversation and returns its id
import { db } from "@/app/db";
import { conversations } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function POST() {
  // Default title if frontend doesn't provide one
  const title = "New Conversation";

  const [conv] = await db
    .insert(conversations)
    .values({ title })
    .returning();

  return NextResponse.json({ id: conv.id });
}
