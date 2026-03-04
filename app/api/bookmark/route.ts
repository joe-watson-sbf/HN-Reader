import { NextRequest } from "next/server";

function parseIds(request: NextRequest): number[] {
  try {
    const cookie = request.cookies.get("bookmarks");
    const ids = cookie ? JSON.parse(cookie.value) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  if (!id || typeof id !== "number") {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const ids = parseIds(request);
  const isBookmarked = ids.includes(id);
  const newIds = isBookmarked ? ids.filter((i) => i !== id) : [...ids, id];

  const response = Response.json({
    bookmarked: !isBookmarked,
    count: newIds.length,
  });

  // Persist to cookie — works on Next.js, vinext dev, and Cloudflare Workers
  // Session cookie — expires when the browser tab/window closes
  response.headers.set(
    "Set-Cookie",
    `bookmarks=${JSON.stringify(newIds)}; Path=/; SameSite=Lax`
  );

  return response;
}
