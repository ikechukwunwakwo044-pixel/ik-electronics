import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSessionValid, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authed = await isSessionValid(session);

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