import Link from "next/link";
import type { HNItem } from "../lib/hn";
import { timeAgo, domain } from "../lib/hn";
import BookmarkButton from "./BookmarkButton";

export default function StoryCard({
  story,
  rank,
  isBookmarked = false,
}: {
  story: HNItem;
  rank?: number;
  isBookmarked?: boolean;
}) {
  const host = domain(story.url);

  return (
    <article className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors">
      <div className="flex gap-3">
        {rank !== undefined && (
          <span className="text-zinc-600 text-sm font-mono w-6 shrink-0 pt-0.5 text-right select-none">
            {rank}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-1 min-w-0">
              {story.url ? (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-100 font-medium leading-snug hover:text-white transition-colors"
                >
                  {story.title}
                </a>
              ) : (
                <Link
                  href={`/story/${story.id}`}
                  className="text-zinc-100 font-medium leading-snug hover:text-white transition-colors"
                >
                  {story.title}
                </Link>
              )}
              {host && (
                <span className="ml-2 text-xs text-zinc-500 shrink-0">
                  ({host})
                </span>
              )}
            </div>
            <BookmarkButton
              id={story.id}
              title={story.title ?? ""}
              url={story.url}
              initialBookmarked={isBookmarked}
            />
          </div>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span className="text-orange-400 font-medium">
              {story.score ?? 0} pts
            </span>
            <span>by {story.by ?? "unknown"}</span>
            <span>{timeAgo(story.time)}</span>
            {(story.descendants ?? 0) > 0 && (
              <Link
                href={`/story/${story.id}`}
                className="hover:text-zinc-300 transition-colors"
              >
                {story.descendants} comments →
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
