import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Don't protect the login route
  if (url.pathname.startsWith("/management/login")) {
    return NextResponse.next();
  }

  // Check for the admin session cookie
  const sessionCookie = req.cookies.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "authenticated") {
    return NextResponse.redirect(new URL("/management/login", req.url));
  }

  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ["/management/:path*"],
};
