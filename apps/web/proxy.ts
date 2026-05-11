import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./app/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/email-verification",
];
const AUTH_ROUTES = ["/login", "/register"];
const DEFAULT_AUTH_REDIRECT = "/app";

const LOCALES = routing.locales;

function extractLocale(pathname: string): {
  locale: string;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] as "id" | "en";

  if (LOCALES.includes(firstSegment)) {
    return {
      locale: firstSegment,
      pathnameWithoutLocale: "/" + segments.slice(1).join("/"),
    };
  }

  return {
    locale: routing.defaultLocale,
    pathnameWithoutLocale: pathname,
  };
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { locale, pathnameWithoutLocale } = extractLocale(pathname);

  if (pathnameWithoutLocale === "/") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}${DEFAULT_AUTH_REDIRECT}`;
    return NextResponse.redirect(redirectUrl);
  }

  const accessToken = request.cookies.get("access-token");
  const isAuthenticated = Boolean(accessToken);

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );

  /**
   * 🔁 CASE 1: User is logged in but accessing /login or /register
   */
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    const redirect = redirectUrl.searchParams.get("redirect");
    if (redirect) {
      redirectUrl.pathname = `/${locale}${redirect}`;
    } else {
      redirectUrl.pathname = `/${locale}${DEFAULT_AUTH_REDIRECT}`;
    }
    redirectUrl.pathname = `/${locale}${DEFAULT_AUTH_REDIRECT}`;
    return NextResponse.redirect(redirectUrl);
  }

  /**
   * 🔐 CASE 2: User is NOT logged in and accessing protected route
   */
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.searchParams.set("redirect", pathnameWithoutLocale || "/app");

    return NextResponse.redirect(loginUrl);
  }
  // 🌍 Continue locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
