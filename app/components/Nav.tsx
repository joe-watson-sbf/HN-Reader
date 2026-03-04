import Link from "next/link";
import { getBookmarkCount } from "../lib/store";

export default async function Nav() {
  const bookmarkCount = await getBookmarkCount();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-orange-400 hover:text-orange-300 transition-colors text-lg tracking-tight"
          >
            HN
          </Link>
          <nav className="flex items-center gap-1">
            {[
              { href: "/?tab=top", label: "Top" },
              { href: "/?tab=new", label: "New" },
              { href: "/?tab=ask", label: "Ask" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bookmarks"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            {bookmarkCount > 0 && (
              <span className="text-xs bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {bookmarkCount}
              </span>
            )}
          </Link>
          <span className="text-xs px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full font-mono">
            vinext
          </span>
        </div>
      </div>
    </header>
  );
}
