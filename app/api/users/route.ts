import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { user } from '@/app/db/schema';


import { auth } from "@/app/lib/auth";
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await db.select().from(user).where(eq(user.id, session.user.id));

    return NextResponse.json(currentUser[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
