import { NextResponse } from "next/server";

// Proxy — replaced deprecated middleware convention (Next.js 16)
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
