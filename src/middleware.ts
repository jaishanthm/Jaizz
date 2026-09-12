import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Phase 1 §12/§44 — admin routes protected at the middleware layer, not
// just per-page checks. Public routes and /admin/login pass through.

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", path);

    // Users-management and audit-log routes are ADMIN-only (Phase 5 §5 lists
    // these as admin-only screens) — everything else under /admin is
    // reachable by EDITOR/VIEWER, gated further at the page/action level per
    // Phase 9 §6's permission-aware UI rule (hide, don't just disable).
    if (path.startsWith("/admin")) {
      const adminOnlyPaths = ["/admin/users", "/admin/audit-log", "/admin/settings"];
      if (adminOnlyPaths.some((p) => path.startsWith(p)) && token?.roleKey !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Enforce auth for admin UI and admin API paths
        if (!path.startsWith("/admin") && !path.startsWith("/api/admin")) return true;
        // Invited users hit this before they have a session — exempt it,
        // same as /admin/login (handled via `pages.signIn` below).
        if (path.startsWith("/admin/set-password")) return true;
        return !!token;
      },
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  matcher: [
    // Match all paths except Next.js internals and public API routes
    // (but include /api/admin/* for auth enforcement)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
