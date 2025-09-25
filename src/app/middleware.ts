// middleware.ts
// import { auth } from "@/lib/auth";
import NextAuth from "next-auth";

// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname.startsWith("/protected")) {
//     const newUrl = new URL("/login", req.url);
//     return Response.redirect(newUrl);
//   }
// });

// Defines which paths the middleware should run on (optional but recommended)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
