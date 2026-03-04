// Cookie-based bookmark store — works on local dev (Next.js/vinext) and Cloudflare Workers.
// Stores an array of bookmarked IDs in the "bookmarks" cookie.

import { cookies } from "next/headers";

export async function getBookmarkedIds(): Promise<Set<number>> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("bookmarks");
  if (!cookie?.value) return new Set();
  try {
    const ids = JSON.parse(cookie.value);
    return new Set(Array.isArray(ids) ? ids : []);
  } catch {
    return new Set();
  }
}

export async function getBookmarkCount(): Promise<number> {
  const ids = await getBookmarkedIds();
  return ids.size;
}
