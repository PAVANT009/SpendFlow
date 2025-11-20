import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json([]);

  const res = await fetch(`https://api.logo.dev/search?q=${q}`, {
    headers: {
      Authorization: `Bearer ${process.env.LOGODEV_SECRET_KEY}`
    }
  });

  const data = await res.json();
  return NextResponse.json(data);
}
