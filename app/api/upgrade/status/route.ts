import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { polarClient } from "@/app/lib/polar";

type PolarError = {
  statusCode?: number;
};

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ isPaid: false }, { status: 401 });
  }

  try {
    const customer = await polarClient.customers.getStateExternal({
      externalId: session.user.id,
    });

    const isPaid = (customer.activeSubscriptions?.length ?? 0) > 0;

    return NextResponse.json({ isPaid });
  } catch (err: unknown) {
    const error = err as PolarError;

    if (error.statusCode === 404) {
      return NextResponse.json({ isPaid: false });
    }

    console.error("Polar subscription check failed:", err);

    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }
}
