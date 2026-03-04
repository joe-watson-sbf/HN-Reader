const BASE = "https://hacker-news.firebaseio.com/v0";

export type HNItem = {
  id: number;
  type: "story" | "comment" | "ask" | "job" | "poll";
  title?: string;
  url?: string;
  text?: string;
  by?: string;
  time: number;
  score?: number;
  descendants?: number;
  kids?: number[];
  parent?: number;
  deleted?: boolean;
  dead?: boolean;
};

async function fetchHN<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`HN API ${res.status}: ${path}`);
  return res.json();
}

export async function getTopStories(count = 30): Promise<number[]> {
  const ids = await fetchHN<number[]>("/topstories.json");
  return ids.slice(0, count);
}

export async function getNewStories(count = 30): Promise<number[]> {
  const ids = await fetchHN<number[]>("/newstories.json");
  return ids.slice(0, count);
}

export async function getAskStories(count = 20): Promise<number[]> {
  const ids = await fetchHN<number[]>("/askstories.json");
  return ids.slice(0, count);
}

export async function getItem(id: number): Promise<HNItem | null> {
  try {
    const item = await fetchHN<HNItem>(`/item/${id}.json`);
    return item ?? null;
  } catch {
    return null;
  }
}

export async function getItems(ids: number[]): Promise<HNItem[]> {
  const items = await Promise.all(ids.map(getItem));
  return items.filter(
    (item): item is HNItem => item !== null && !item.deleted && !item.dead
  );
}

export function timeAgo(unix: number): string {
  const seconds = Math.floor(Date.now() / 1000 - unix);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function domain(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
