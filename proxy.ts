import { auth } from "./auth/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

export const proxy = auth((req: NextAuthRequest) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage  = req.nextUrl.pathname === "/admin/login";
  const isLoggedIn   = !!req.auth;

  // Si es una ruta admin y no está logueado → al login
  if (isAdminRoute && !isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  // Si ya está logueado y va al login → al dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
