import { Suspense } from "react";
import { getTopStories, getNewStories, getAskStories, getItems } from "./lib/hn";
import { store } from "./lib/store";
import Nav from "./components/Nav";
import StoryCard from "./components/StoryCard";
import SearchBar from "./components/SearchBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HN Reader — vinext stress test",
  description:
    "A Hacker News reader built to challenge vinext: RSC streaming, server actions, dynamic routes, ISR, middleware, and recursive async components.",
};

// ISR: background-revalidate the page every 60 seconds
export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab = "top", q = "" } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* SearchBar is a client component — must be in Suspense because it reads URL state */}
        <Suspense
          fallback={
            <div className="h-24 bg-zinc-900 rounded-xl animate-pulse mb-6" />
          }
        >
          <SearchBar currentTab={tab} currentQuery={q} />
        </Suspense>

        {/* Stories stream in — key forces re-mount when tab/query changes */}
        <Suspense key={`${tab}-${q}`} fallback={<StoriesSkeleton />}>
          <StoryFeed tab={tab} query={q} />
        </Suspense>
      </main>
    </div>
  );
}

async function StoryFeed({ tab, query }: { tab: string; query: string }) {
  const ids =
    tab === "new"
      ? await getNewStories(30)
      : tab === "ask"
        ? await getAskStories(20)
        : await getTopStories(30);

  const stories = await getItems(ids);

  const filtered = query
    ? stories.filter((s) =>
        s.title?.toLowerCase().includes(query.toLowerCase())
      )
    : stories;

  const bookmarkedIds = store.ids();

  if (!filtered.length) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <p>No stories match &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((story, i) => (
        <StoryCard
          key={story.id}
          story={story}
          rank={i + 1}
          isBookmarked={bookmarkedIds.has(story.id)}
        />
      ))}
      <p className="text-center text-xs text-zinc-600 pt-4">
        {filtered.length} stories · revalidates every 60s · rendered by vinext
      </p>
    </div>
  );
}

function StoriesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-18 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"
          style={{ opacity: 1 - i * 0.06 }}
        />
      ))}
    </div>
  );
}
