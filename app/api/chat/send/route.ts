import OpenAI from "openai";
import { db } from "@/app/db";
import { messages, subscription } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const content = searchParams.get("content");

  if (!conversationId || !content) {
    console.error("[Request] Missing conversationId or content");
    return new Response("Missing conversationId or content", { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    console.error("[Auth] Unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = String(session.user.id);
  console.log(
    "[Request] conversationId:",
    conversationId,
    "userId:",
    userId,
    "content:",
    content
  );

  // Save user message
  console.log("[DB] Saving user message:", content);
  await db.insert(messages).values({
    userId: userId,
    conversationId,
    role: "user",
    content,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let assistantMessage = "";

      let toolCallId: string | null = null;
      let toolCallName: string | null = null;
      let toolCallArgs = ""; 

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          { role: "system", content: "You are a helpful assistant. and use only this  categories: Entertainment Productivity Health & Fitness Development Cloud Learning" },
          { role: "user", content },
        ],
        tools: [
        {
          type: "function",
          function: {
            name: "createSubscription",
            description: "Create a subscription in the database.",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string" },
                amount: { type: "number" },
                currency: { type: "string" },
                category: { 
                  type: "string",
                  enum: [
                    "Entertainment",
                    "Productivity",
                    "Health & Fitness",
                    "Development",
                    "Cloud",
                    "Learning"
                  ] 
                },
                cycleType: { type: "string" },
                cycleCount: { type: "number" },
              },
              required: ["name", "amount", "currency"],
            },
          },
        },
      ]

        // tools: [
        //   {
        //     type: "function",
        //     function: {
        //       name: "createSubscription",
        //       description: "Create a subscription in the database.",
        //       parameters: {
        //         type: "object",
        //         properties: {
        //           name: { type: "string" },
        //           amount: { type: "number" },
        //           currency: { type: "string" },
        //           category: { type: "string" },
        //           cycleType: { type: "string" },
        //           cycleCount: { type: "number" },
        //         },
        //         required: ["name", "amount", "currency"],
        //       },
        //     },
        //   },
        // ],
      });

      for await (const chunk of completion) {
        const delta = chunk.choices[0].delta;
        console.log("[Stream] Delta chunk:", delta);

        if (delta?.tool_calls?.length) {
          const toolCall = delta.tool_calls[0];

          if (toolCall.id) {
            toolCallId = toolCall.id;
          }
          if (toolCall.function?.name) {
            toolCallName = toolCall.function.name;
          }

          if (toolCall.function?.arguments) {
            toolCallArgs += toolCall.function.arguments;
            console.log("[Tool] Accumulated args so far:", toolCallArgs);
          }
        }

        if (delta?.content) {
          console.log("[Assistant] Streaming text chunk:", delta.content);
          controller.enqueue(encoder.encode(`data: ${delta.content}\n\n`));
          assistantMessage += delta.content;
        }

        if (chunk.choices[0].finish_reason) {
          console.log("[Stream] Finish reason:", chunk.choices[0].finish_reason);

          if (toolCallId && toolCallName === "createSubscription" && toolCallArgs) {
            let args;
            try {
              args = JSON.parse(toolCallArgs);
              console.log("[Tool] Final parsed args:", args);
            } catch (err) {
              console.error("[Tool] Failed to parse final tool args:", toolCallArgs, err);
              const errorMsg = "Error: Invalid tool arguments";
              controller.enqueue(encoder.encode(`data: ${errorMsg}\n\n`));
              assistantMessage += errorMsg;
              break;
            }

            let companyData = [];
            try {
              companyData = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/company-search?q=${args.name}`
              ).then((r) => r.json());
            } catch (err) {
              console.error("[Tool] Company search failed for:", args.name, err);
            }

            const top = companyData?.[0];

            try {
              await db.insert(subscription).values({
                id: crypto.randomUUID(),
                userId,
                name: top?.name || args.name,
                amount: String(args.amount),
                currency: args.currency,
                category: args.category ?? null,
                cycleType: args.cycleType ?? null,
                cycleCount: args.cycleCount ?? 1,
                logoUrl: top?.logo_url ?? null,
                url: top?.domain ?? null,
                description: null,
                startBilling: new Date(),
                nextBilling: new Date(),
                reminder: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              console.log("[DB] Subscription saved:", args.name, "userId:", userId);
            } catch (err) {
              console.error("[DB] Failed to save subscription:", args.name, err);
              const errorMsg = "Error saving subscription";
              controller.enqueue(encoder.encode(`data: ${errorMsg}\n\n`));
              assistantMessage += errorMsg;
              break;
            }

            const success = `Subscription "${args.name}" created successfully! 🎉`;
            controller.enqueue(encoder.encode(`data: ${success}\n\n`));
            assistantMessage += success;
          }

          break; 
        }
      }

      console.log("[Assistant] Final message saved:", assistantMessage);
      await db.insert(messages).values({
        userId: userId,
        conversationId,
        role: "assistant",
        content: assistantMessage,
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}



// import OpenAI from "openai";
// import { db } from "@/app/db";
// import { messages, subscription } from "@/app/db/schema";
// import { auth } from "@/app/lib/auth";
// import { NextResponse } from "next/server";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const conversationId = searchParams.get("conversationId");
//   const content = searchParams.get("content");

//       const session = await auth.api.getSession({ headers: req.headers });
  
//       if (!session || !session.user) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }
  
//       const userId = String(session.user.id);

//   if (!conversationId || !content) {
//     return new Response("Missing conversationId or content", { status: 400 });
//   }

//   await db.insert(messages).values({
//     conversationId,
//     role: "user",
//     content,
//   });

//   const encoder = new TextEncoder();

//   const stream = new ReadableStream({
//     async start(controller) {
//       let assistantMessage = "";

//       const completion = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         stream: true,
//         messages: [{ role: "user", content }],
//         tools: [
//           {
//             type: "function",
//             function: {
//               name: "createSubscription",
//               description: "Create a subscription using external company search and save to DB",
//               parameters: {
//                 type: "object",
//                 properties: {
//                   name: { type: "string" },
//                   amount: { type: "number" },
//                   currency: { type: "string" },
//                   category: { type: "string" },
//                   cycleType: { type: "string" },
//                   cycleCount: {type: "number"}
//                 },
//                 required: ["name", "amount", "currency"],
//               },
//             },
//           },
//         ],
//       });

//       for await (const chunk of completion) {
//         const delta = chunk.choices[0].delta;

//         if (delta?.tool_calls?.[0].function?.arguments ) {
//           const args = JSON.parse(delta.tool_calls[0].function.arguments);

//           const companyData = await fetch(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/api/company-search?q=${args.name}`
//           ).then((r) => r.json());

//           const top = companyData[0]; // best result

//         await db.insert(subscription).values({
//           id: crypto.randomUUID(),
//           userId,     // from session or param
//           name: args.name,
//           amount: String(args.amount),
//           currency: args.currency,
//           category: args.category,
//           cycleType: args.cycleType,
//           cycleCount: Number(args.cycleCount),
//           logoUrl: top?.logo,
//           url: top?.url,
//           description: null,
//           startBilling: new Date(),
//           nextBilling: new Date(),
//           reminder: false,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });

//           const success = `Subscription "${args.name}" created successfully!`;
//           assistantMessage += success;
//           controller.enqueue(encoder.encode(`data: ${success}\n\n`));
//           break;
//         }

//         if (delta?.content) {
//           assistantMessage += delta.content;
//           controller.enqueue(encoder.encode(`data: ${delta.content}\n\n`));
//         }
//       }

//       await db.insert(messages).values({
//         conversationId,
//         role: "assistant",
//         content: assistantMessage,
//       });

//       controller.close();
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }



// // app/api/chat/send/route.ts
// import OpenAI from "openai";
// import { db } from "@/app/db";
// import { messages } from "@/app/db/schema";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const conversationId = searchParams.get("conversationId");
//   const content = searchParams.get("content");

//   if (!conversationId || !content) {
//     return new Response("Missing conversationId or content", { status: 400 });
//   }

//   await db.insert(messages).values({
//     conversationId,
//     role: "user",
//     content,
//   });

//   const encoder = new TextEncoder();
//   const readable = new ReadableStream({
//     async start(controller) {
//       let assistantMessage = "";

//       const completion = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [{ role: "user", content }],
//         stream: true,
//       });

//       for await (const chunk of completion) {
//         const text = chunk.choices[0]?.delta?.content;
//         if (!text) continue;
//         assistantMessage += text;
//         controller.enqueue(encoder.encode(`data: ${text}\n\n`));
//       }

//       await db.insert(messages).values({
//         conversationId,
//         role: "assistant",
//         content: assistantMessage,
//       });

//       controller.close();
//     },
//   });

//   return new Response(readable, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }
