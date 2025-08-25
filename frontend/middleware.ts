// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (Date.now() > token.accessTokenExpires!) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role;

  if (
    pathname.startsWith("/application/admin") &&
    !(role === "ADMIN" || role === "ANALYZER")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (
    pathname.startsWith("/application/user") &&
    !(role === "ADMIN" || role === "ANALYZER" || role === "USER")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/application/:path*"], // protect all under /application
};
