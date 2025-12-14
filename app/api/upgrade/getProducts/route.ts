import { NextRequest, NextResponse } from "next/server";
import { polarClient } from "@/app/lib/polar";
import { auth } from "@/app/lib/auth"; 

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await polarClient.products.list({
    isArchived: false,
    isRecurring: true,
    sorting: ["price_amount"],
  });

  return NextResponse.json(products.result.items);
}
