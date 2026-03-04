// In-memory bookmark store — demo only. Use a DB (D1, Postgres) in production.
// On Cloudflare Workers, swap this for KV: import { env } from "cloudflare:workers"

export type BookmarkEntry = {
  id: number;
  title: string;
  url?: string;
  savedAt: number;
};

const bookmarks = new Map<number, BookmarkEntry>();

export const store = {
  toggle(data: { id: number; title: string; url?: string }): boolean {
    if (bookmarks.has(data.id)) {
      bookmarks.delete(data.id);
      return false;
    }
    bookmarks.set(data.id, { ...data, savedAt: Date.now() });
    return true;
  },

  has(id: number): boolean {
    return bookmarks.has(id);
  },

  getAll(): BookmarkEntry[] {
    return Array.from(bookmarks.values()).sort((a, b) => b.savedAt - a.savedAt);
  },

  ids(): Set<number> {
    return new Set(bookmarks.keys());
  },

  count(): number {
    return bookmarks.size;
  },
};
