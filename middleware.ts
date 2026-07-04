import { NextRequest, NextResponse } from "next/server";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

// Routes that are always accessible (Next.js internals, API auth routes, static files)
const PUBLIC_PREFIXES = [
  "/api/auth", // better-auth API routes must always be accessible
  "/_next",
  "/favicon.ico",
  "/public",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public prefixes through without any check
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow explicit public routes (exact match)
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check session via the cookie that better-auth sets
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    // No session cookie → redirect to sign-in
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all paths EXCEPT:
   *  - Next.js internals  (_next/*)
   *  - Static files       (favicon.ico, images, etc.)
   *  - API auth routes    (api/auth/*)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
