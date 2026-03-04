import Link from "next/link";
import type { Metadata } from "next";
import { store } from "../lib/store";
import Nav from "../components/Nav";
import { domain } from "../lib/hn";

export const metadata: Metadata = {
  title: "Bookmarks — HN Reader",
};

// Always render fresh — we need current bookmark state
export const dynamic = "force-dynamic";

export default function BookmarksPage() {
  const bookmarks = store.getAll();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-semibold text-white">Bookmarks</h1>
          <span className="text-sm text-zinc-500">{bookmarks.length} saved</span>
        </div>

        {bookmarks.length === 0 ? (
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
        ) : (
          <div className="space-y-3">
            {bookmarks.map((item) => {
              const host = domain(item.url);
              return (
                <article
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-100 font-medium hover:text-white transition-colors leading-snug"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          href={`/story/${item.id}`}
                          className="text-zinc-100 font-medium hover:text-white transition-colors leading-snug"
                        >
                          {item.title}
                        </Link>
                      )}
                      {host && (
                        <span className="ml-2 text-xs text-zinc-500">
                          ({host})
                        </span>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-600">
                        <Link
                          href={`/story/${item.id}`}
                          className="hover:text-zinc-400 transition-colors"
                        >
                          View comments →
                        </Link>
                        <span>
                          Saved{" "}
                          {new Date(item.savedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
