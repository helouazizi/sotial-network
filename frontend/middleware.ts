import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ Allow internal system routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes("not-found")
  ) {
    return NextResponse.next();
  }

  try {
    const response = await fetch('http://localhost:8080/api/v1/user/Auth', {
      headers: {
        Cookie: request.headers.get('cookie') || ""
      }
    });

    const isAuth = response.ok;

    if (!isAuth) {
      if (pathname === "/login" || pathname === "/register") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware Error:", err);
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/chat/:path*',
    '/chat',
    '/profile/:path*',
    '/groups/:path*',
  ],
};
