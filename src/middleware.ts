// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("middleware");
  // Example: Check for a session cookie (e.g., "next-auth.session-token")
  const sessionCookie =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.next();

  // Pass url for Navbar component
  response.headers.set("x-pathname", new URL(req.url).pathname);

  // Let the request continue
  return response;
}

// Optional: define which paths the middleware should run on
export const config = {
  matcher: ["/home/:path*", "/settings/:path*"], // run middleware only on these routes
};
