"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBookmarks } from "../components/BookmarkContext";
import StoryCard from "../components/StoryCard";
import type { HNItem } from "../lib/hn";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

async function fetchItem(id: number): Promise<HNItem | null> {
  try {
    const res = await fetch(`${HN_BASE}/item/${id}.json`);
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export default function BookmarksContent() {
  const { ids } = useBookmarks();
  const [stories, setStories] = useState<HNItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idsArray = [...ids];
    if (idsArray.length === 0) {
      setStories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(idsArray.map(fetchItem)).then((items) => {
      setStories(items.filter(Boolean) as HNItem[]);
      setLoading(false);
    });
  }, [ids]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-18 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"
            style={{ opacity: 1 - i * 0.2 }}
          />
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-zinc-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <p className="mb-4">No bookmarks yet.</p>
        <Link
          href="/"
          className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
        >
          Browse stories →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
