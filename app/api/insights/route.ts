import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Subscription } from "@/types/Subscription";



interface AISuggestion {
  suggestion: string;
  confidence: number;
}

export async function POST(req: Request) {
  let subscription: Subscription;

  try {
    const body = await req.json();
    if (!body.subscription) {
      return NextResponse.json(
        { error: "Missing 'subscription' in request body." },
        { status: 400 }
      );
    }
    subscription = body.subscription;
  } catch (err) {
    console.error("Body Parse Error:", err);
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY missing");
    return NextResponse.json(
      { error: "API key missing on server." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are a financial assistant specializing in subscriptions.
    Analyze this subscription and return ONLY JSON.
    

    Subscription:
    ${JSON.stringify(subscription, null, 2)}

    Respond ONLY in JSON format like this:
    {
      "suggestion": "string",
      "confidence": 0.0-1.0
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const raw = result.response.text().trim();

    // Parse JSON response
    const parsed: AISuggestion = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI Error:", err);
    return NextResponse.json(
      { error: "AI generation failed." },
      { status: 500 }
    );
  }
}
