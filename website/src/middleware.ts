import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("crm_session")?.value;
  const authed = token ? verifyToken(token) !== null : false;

  if (pathname === "/admin/login") {
    if (authed) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  if (!authed) {
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
