import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fallback secret matching local .env to prevent Edge Runtime crash if NEXTAUTH_SECRET is omitted in Vercel
const DEFAULT_SECRET = "f657bc89d2e76f784e1b8c6a5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);

  const isAdminPath = path.startsWith("/admin");
  const isAdminApiPath = path.startsWith("/api/admin");

  // Fast path: Public routes pass through without evaluating auth
  if (!isAdminPath && !isAdminApiPath) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Exempt public admin screens (login and invite setup)
  if (path.startsWith("/admin/login") || path.startsWith("/admin/set-password")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Safe token verification with fallback secret
  const secret = process.env.NEXTAUTH_SECRET || DEFAULT_SECRET;
  let token = null;
  try {
    token = await getToken({ req, secret });
  } catch (err) {
    console.error("Middleware token verification error:", err);
  }

  if (!token) {
    if (isAdminApiPath) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only subroutes (Users, Audit Log, Settings)
  const adminOnlyPaths = ["/admin/users", "/admin/audit-log", "/admin/settings"];
  if (adminOnlyPaths.some((p) => path.startsWith(p)) && (token as any)?.roleKey !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
