// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl;

  const redirectToLogin = () => {
    const loginUrl = new URL("/login", req.url);
    // Use absolute URL for callbackUrl (NextAuth-friendly)
    loginUrl.searchParams.set("callbackUrl", url.toString());
    return NextResponse.redirect(loginUrl);
  };

  if (!token) return redirectToLogin();

  if (Date.now() > (token as any).accessTokenExpires!) return redirectToLogin();

  const role = (token as any).role;
  const pathname = url.pathname;

  if (pathname.startsWith("/application/admin") && !(role === "ADMIN" || role === "ANALYZER")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/application/user") && !(role === "ADMIN" || role === "ANALYZER" || role === "USER")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/application/:path*"],
};
