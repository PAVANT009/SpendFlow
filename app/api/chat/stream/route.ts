// app/api/chat/stream/route.ts
import OpenAI from "openai"
import { eq } from "drizzle-orm";
import { db } from "@/app/db";
import { messages } from "@/app/db/schema";

export const runtime = "edge";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cid = searchParams.get("cid");

  const history = await db.query.messages.findMany({
    where: eq(messages.conversationId, cid!),
    orderBy: (m, { asc }) => [asc(m.createdAt)],
  });

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: history.map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content
    })),
  });

  const encoder = new TextEncoder();
  let fullText = "";

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        fullText += delta;
        controller.enqueue(encoder.encode(`data: ${delta}\n\n`));
      }

      await db.insert(messages).values({
        conversationId: cid!,
        role: "assistant",
        content: fullText,
      });

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}
