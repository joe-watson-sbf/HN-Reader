import { NextRequest, NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Powered-By", "vinext/vite");
  response.headers.set("X-Request-Time", new Date().toISOString());
  response.headers.set(
    "X-Runtime",
    process.env.npm_lifecycle_event ?? "unknown"
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
