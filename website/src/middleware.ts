import { NextResponse, type NextRequest } from "next/server";

/**
 * Visitor tracking cookies, set in middleware so ids exist before paint:
 *  - crescent_vid: 1 year, stable visitor id
 *  - crescent_sid: 30 minutes (sliding), session id
 * Session attribution lives in lib/track.ts; this only issues ids.
 */
const YEAR = 60 * 60 * 24 * 365;
const THIRTY_MIN = 60 * 30;

function id() {
  return `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (!req.cookies.get("crescent_vid")) {
    res.cookies.set("crescent_vid", id(), {
      maxAge: YEAR,
      sameSite: "lax",
      path: "/",
    });
  }
  const existingSid = req.cookies.get("crescent_sid")?.value;
  if (!existingSid) {
    res.cookies.set("crescent_sid", id(), {
      maxAge: THIRTY_MIN,
      sameSite: "lax",
      path: "/",
    });
  } else {
    // Sliding expiry: keep the session alive while the visitor keeps moving
    res.cookies.set("crescent_sid", existingSid, {
      maxAge: THIRTY_MIN,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
