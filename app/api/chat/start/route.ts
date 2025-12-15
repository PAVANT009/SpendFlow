import { db } from "@/app/db";
import { conversations } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { polarClient } from "@/app/lib/polar";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const title = "New Conversation";

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const customer = await polarClient.customers.getStateExternal({
    externalId: userId,
  });

  const isPaid =
    customer.activeSubscriptions &&
    customer.activeSubscriptions.length > 0;

  if (!isPaid) {
    return NextResponse.json(
      {
        error: "Upgrade required",
        code: "PAYMENT_REQUIRED",
      },
      { status: 403 }
    );
  }

  try {
    const [conv] = await db
      .insert(conversations)
      .values({
        userId,
        title,
      })
      .returning();

    return NextResponse.json({ id: conv.id });
  } catch (error) {
    console.error("[DB] Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// import { db } from "@/app/db";
// import { conversations } from "@/app/db/schema";
// import { auth } from "@/app/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const title = "New Conversation";
//   const session = await auth.api.getSession({ headers: req.headers });

//   if (!session || !session.user) {
//     console.error("[Auth] Unauthorized request");
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
    
//     const userId = String(session.user.id);
    
//     const [conv] = await db
//     .insert(conversations)
//     .values({ 
//       userId: userId,
//       title
//     })
//     .returning();
//     return NextResponse.json({ id: conv.id });
//   } catch (error) {
//     console.error("[DB] Error creating conversation:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }

// }
