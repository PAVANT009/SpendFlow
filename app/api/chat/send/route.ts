// app/api/chat/send/route.ts
import OpenAI from "openai";
import { db } from "@/app/db";
import { messages } from "@/app/db/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const content = searchParams.get("content");

  if (!conversationId || !content) {
    return new Response("Missing conversationId or content", { status: 400 });
  }

  // Save user message
  await db.insert(messages).values({
    conversationId,
    role: "user",
    content,
  });

  // SSE streaming
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let assistantMessage = "";

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content }],
        stream: true,
      });

      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content;
        if (!text) continue;
        assistantMessage += text;
        controller.enqueue(encoder.encode(`data: ${text}\n\n`));
      }

      // Save assistant message after streaming
      await db.insert(messages).values({
        conversationId,
        role: "assistant",
        content: assistantMessage,
      });

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
