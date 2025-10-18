// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return NextResponse.redirect(new URL("/recent", req.url));
  }
  return NextResponse.next();
}

// ルートだけ対象にする
export const config = {
  matcher: ["/"],
};
