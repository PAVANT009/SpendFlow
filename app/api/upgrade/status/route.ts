import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { polarClient } from "@/app/lib/polar";
import Error from "next/error";

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

    const isPaid = customer.activeSubscriptions?.length > 0;

    return NextResponse.json({ isPaid });
  } catch (err : any)  {
    // Customer not created yet = free user
    if (err.statusCode === 404) {
      return NextResponse.json({ isPaid: false });
    }

    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }
}
