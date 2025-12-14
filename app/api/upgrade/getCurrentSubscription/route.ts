import { auth } from "@/app/lib/auth";
import { polarClient } from "@/app/lib/polar";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = await polarClient.customers.getStateExternal({
    externalId: session.user.id,
  });

  const subscription = customer.activeSubscriptions[0];

  if (!subscription) return NextResponse.json(null);

  const product = await polarClient.products.get({
    id: subscription.productId,
  });

  return NextResponse.json(product);
}
