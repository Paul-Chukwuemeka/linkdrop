import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { resolveGuardAction } from "@/lib/guard";

export async function proxy(request: NextRequest) {
  let isLoggedIn = false;
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: request.nextUrl.protocol === "https:",
    });
    isLoggedIn = Boolean(token);
  } catch (err) {
    console.error("[proxy] token check failed:", err);
  }
  const pathname = request.nextUrl.pathname;

  const action = resolveGuardAction(isLoggedIn, pathname);

  if (action.kind === "dashboard-redirect") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (action.kind === "login-redirect") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", action.next);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
