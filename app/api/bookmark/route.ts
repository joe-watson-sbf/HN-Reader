import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  if (!id || typeof id !== "number") {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Use cookies() from next/headers — the same API as server components.
  // More reliable than request.cookies which can miss recently-set values.
  const cookieStore = await cookies();
  const existing = cookieStore.get("bookmarks");

  let currentIds: number[] = [];
  try {
    currentIds = existing ? JSON.parse(existing.value) : [];
    if (!Array.isArray(currentIds)) currentIds = [];
  } catch {
    currentIds = [];
  }

  const isBookmarked = currentIds.includes(id);
  const newIds = isBookmarked
    ? currentIds.filter((i) => i !== id)
    : [...currentIds, id];

  const response = NextResponse.json({
    bookmarked: !isBookmarked,
    count: newIds.length,
  });

  // Use NextResponse.cookies.set — the proper Next.js API for setting cookies
  response.cookies.set("bookmarks", JSON.stringify(newIds), {
    path: "/",
    sameSite: "lax",
    // session cookie — no maxAge/expires
  });

  return response;
}
