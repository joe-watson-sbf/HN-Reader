"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

const TABS = [
  { value: "top", label: "Top" },
  { value: "new", label: "New" },
  { value: "ask", label: "Ask" },
] as const;

export default function SearchBar({
  currentTab,
  currentQuery,
}: {
  currentTab: string;
  currentQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const navigate = (tab: string, q: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (tab && tab !== "top") params.set("tab", tab);
      if (q) params.set("q", q);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") as string;
    navigate(currentTab, q);
  };

  return (
    <div className={`mb-6 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => navigate(value, currentQuery)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentTab === value
                ? "bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
        {isPending && (
          <span className="text-xs text-zinc-500 ml-2 animate-pulse">
            Loading…
          </span>
        )}
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          name="q"
          type="search"
          placeholder="Filter stories…"
          defaultValue={currentQuery}
          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
