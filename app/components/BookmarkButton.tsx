"use client";

import { useBookmarks } from "./BookmarkContext";

export default function BookmarkButton({ id }: { id: number }) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(id);

  return (
    <button
      onClick={() => toggle(id)}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this story"}
      className={`shrink-0 p-1.5 rounded-lg transition-all ${
        bookmarked
          ? "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20"
          : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
