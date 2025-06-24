import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const res = await fetch("http://localhost:8080/app/v1/user/Auth", {
      credentials: "include",
    });
    console.log(res , "res");
    
    if (res.ok) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
