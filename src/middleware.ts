import {NextRequest, NextResponse} from "next/server";

import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const {pathname} = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/success",
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/me",
    "/api/auth/logout",
    "/api/upload-auth",
    "/api/stripe/checkout",
    "/api/stripe/webhook",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - require authentication for upload and studio
  const protectedRoutes = ["/upload", "/studio"];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
