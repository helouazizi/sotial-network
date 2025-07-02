import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  try {
    let response = await fetch('http://localhost:8080/app/v1/user/Auth', {
      headers: {
        Cookie: request.headers.get('cookie') || ""
      }
    })

    if (!response.ok) {
      if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
        return NextResponse.next()
      }

     return NextResponse.redirect(new URL("/login", request.nextUrl))
    }

    if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
      return NextResponse.redirect(new URL("/", request.nextUrl))
    }

    return NextResponse.next()
  } catch (err) {
    console.error("Error :", err)
    if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
      return NextResponse.next()
    }
    
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

}

export const config = {
  matcher: ['/', "/login", "/register", "/chat/:path*", "/chat","/profile/:path*"],
}