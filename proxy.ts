import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("lf_session")?.value;
  const isLoggedIn = session === "1";
  const pathname = request.nextUrl.pathname;

  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

