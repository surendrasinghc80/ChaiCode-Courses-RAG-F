import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;
    const isAuth = !!req.nextauth.token;
    const isAuthRoute = ["/login", "/signup"].includes(nextUrl.pathname);
    const isRootRoute = nextUrl.pathname === "/";

    // Allow NextAuth/api/internal and static assets
    const publicPaths = [
      "/api/auth",
      "/_next",
      "/favicon.ico",
      "/icon.svg",
      "/gradiant-bg-1.jpg",
      "/gradiant-bg-10.jpg",
    ];
    if (publicPaths.some((p) => nextUrl.pathname.startsWith(p))) {
      return NextResponse.next();
    }

    // Allow unauthenticated users to access root path (landing page)
    if (!isAuth && isRootRoute) {
      return NextResponse.next();
    }

    if (!isAuth && !isAuthRoute) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set(
        "callbackUrl",
        nextUrl.pathname + nextUrl.search
      );
      return NextResponse.redirect(loginUrl);
    }

    if (isAuth && isAuthRoute) {
      return NextResponse.redirect(new URL("/app", nextUrl));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Let middleware handle auth logic
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon.svg|public).*)",
  ],
};
