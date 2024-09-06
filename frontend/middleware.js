// frontend/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get('token');

  if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register'))
    return NextResponse.redirect(new URL('/', req.url));

  return NextResponse.next();
}