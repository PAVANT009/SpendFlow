import { db } from "@/app/db";
import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await context.params;

    const messages = await db.query.messages.findMany({
      where: (fields, { eq }) => eq(fields.conversationId, conversationId),
    });

    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to get messages", details: String(err) },
      { status: 500 }
    );
  }
}



// import { db } from "@/app/db";
// import { auth } from "@/app/lib/auth";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     try{
//         const session = await auth.api.getSession({ headers: req.headers });

//             if (!session || !session.user) {
//               return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//             }
        
//             const { searchParams } = new URL(req.url);
//             const conversationId = searchParams.get("conversationId");
//             if (!conversationId) {
//                 return NextResponse.json({ error: "Conversation Id Required" }, { status: 400 });   
//             }
//             const messages = await db.query.messages.findMany({
//                 where: (fields, { eq }) => (
//                     eq(fields.conversationId , conversationId)
//                 ),
//             });

//             return NextResponse.json(
//                 messages
//             )

//     }
//     catch(err) {
//         return NextResponse.json(
//               { error: "Failed to get stats", details: String(err) },
//               { status: 500 }
//             );
//     }


// }