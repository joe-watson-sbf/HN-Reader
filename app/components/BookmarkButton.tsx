"use client";

import { useOptimistic, useTransition } from "react";

export default function BookmarkButton({
  id,
  title,
  url,
  initialBookmarked,
}: {
  id: number;
  title: string;
  url?: string;
  initialBookmarked: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(initialBookmarked);

  const handleToggle = () => {
    startTransition(async () => {
      // Optimistic update — icon flips instantly, no page refresh
      setOptimistic(!optimistic);

      // Plain fetch to a route handler — does NOT trigger Next.js router refresh
      await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, url }),
      });
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={optimistic ? "Remove bookmark" : "Bookmark this story"}
      className={`shrink-0 p-1.5 rounded-lg transition-all ${
        optimistic
          ? "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20"
          : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill={optimistic ? "currentColor" : "none"}
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
