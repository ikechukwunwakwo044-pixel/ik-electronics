import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSessionValue, sessionCookieMeta } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(sessionCookieMeta().name)?.value;
  const authed = isSessionValue(session);

  if (!authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "next=" + encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/categories/:path*"],
};